export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import {
  handleIdeaGeneration,
  handleContentCreation,
  handleContentAtomizer,
  handleContentImprover,
  handleSEOSupport,
} from '@/lib/services/aiService';
import { UsageStatsService } from '@/lib/services/usageStatsService';
import tokenEstimationService from '@/lib/services/tokenEstimationService';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    // 1. Authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const userId = session.user.id;
    const subscriptionLevel = (session.user as any).userSubscriptionLevel || 'free';
    // 2. DB Connect
    await dbConnect();

    // 3. Rate Limiting (Pre-Check 1)
    const requestsLeft = (await UsageStatsService.checkRateLimit(userId, subscriptionLevel)).canProceed;
    if (!requestsLeft) {
      return NextResponse.json(
        { success: false, error: 'Hourly request limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // 4. Parse and validate request
    const body = await request.json();
    const { tool, payload } = body;
    if (!tool || typeof tool !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid tool name.' },
        { status: 400 }
      );
    }
    if (!payload || typeof payload !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid payload.' },
        { status: 400 }
      );
    }

    // 5. Input Validation (Pre-Check 2)
    // Map tool to validator input
    let validation;
    switch (tool) {
      case 'ideaGeneration':
        validation = payload.topicPrompt && typeof payload.topicPrompt === 'string';
        break;
      case 'contentCreation':
        validation = payload.headline && payload.metaDescription && payload.tone;
        break;
      case 'contentAtomizer':
        validation = payload.articleContent && Array.isArray(payload.platforms);
        break;
      case 'contentImprover':
        validation = payload.articleContent && Array.isArray(payload.preferences);
        break;
      case 'seoSupport':
        validation = payload.articleContent || payload.draftHeadline;
        break;
      default:
        validation = false;
    }
    if (!validation) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing fields for tool: ' + tool },
        { status: 400 }
      );
    }

    // 6. Token Estimation & Credit Check (Pre-Check 3)
    // For estimation, use the most relevant field
    let estimationInput = '';
    if (tool === 'ideaGeneration') estimationInput = payload.topicPrompt;
    else if (tool === 'contentCreation') estimationInput = payload.headline + ' ' + payload.metaDescription;
    else if (tool === 'contentAtomizer' || tool === 'contentImprover' || tool === 'seoSupport') estimationInput = payload.articleContent || payload.draftHeadline || '';
    const estimatedTokens = tokenEstimationService.estimateUserTokensOnly(tool, estimationInput);
    const canProceed = await UsageStatsService.canUserProceed(userId, subscriptionLevel, estimatedTokens);
    if (!canProceed) {
      const currentStats = await UsageStatsService.getUsageStatsResponse(userId, subscriptionLevel);
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient tokens. Estimated ${estimatedTokens} tokens needed, but only ${currentStats.hourlyTokensRemaining} remaining.`,
          usageStats: {
            hourlyRequestsRemaining: currentStats.hourlyRequestsRemaining,
            hourlyTokensRemaining: currentStats.hourlyTokensRemaining,
            hourlyTotalRequests: currentStats.hourlyTotalRequests,
            hourlyTotalTokens: currentStats.hourlyTotalTokens,
            tokensUsed: currentStats.tokensUsed,
            requestsUsed: currentStats.requestsUsed,
          },
          estimatedTokens,
        },
        { status: 429 }
      );
    }

    // 7. Delegate to AI Service
    let aiResult: any, actualTokens = estimatedTokens;
    try {
      switch (tool) {
        case 'ideaGeneration':
          aiResult = await handleIdeaGeneration(payload);
          break;
        case 'contentCreation':
          aiResult = await handleContentCreation(payload);
          break;
        case 'contentAtomizer':
          aiResult = await handleContentAtomizer(payload);
          break;
        case 'contentImprover':
          aiResult = await handleContentImprover(payload);
          break;
        case 'seoSupport':
          aiResult = await handleSEOSupport(payload);
          break;
        default:
          return NextResponse.json(
            { success: false, error: 'Unknown tool: ' + tool },
            { status: 400 }
          );
      }
      
      // Check if AI service returned an error
      if (!aiResult.success) {
        return NextResponse.json(
          { success: false, error: aiResult.error },
          { status: 500 }
        );
      }
      
      // Use actual OpenAI token usage for accurate billing
      if (aiResult.usage && typeof aiResult.usage.total_tokens === 'number') {
        actualTokens = tokenEstimationService.calculateUserTokensUsed(aiResult.usage.total_tokens, tool);
      } else {
        // Fallback to estimated tokens if OpenAI usage is not available
        console.warn('No OpenAI usage data available, using estimated tokens for tool:', tool);
        actualTokens = estimatedTokens;
      }
    } catch (err: any) {
      return NextResponse.json(
        { success: false, error: err.message || 'AI processing failed.' },
        { status: 500 }
      );
    }

    // 8. Usage Update (Post-Check 1)
    let updatedUsageStats;
    try {
      await UsageStatsService.updateUsageStats(userId, 1, actualTokens);
      updatedUsageStats = await UsageStatsService.getUsageStatsResponse(userId, subscriptionLevel);
      await User.findByIdAndUpdate(userId, { $inc: { aiGenerationsCount: 1 } }, { new: true });
    } catch (usageError) {
      updatedUsageStats = await UsageStatsService.getUsageStatsResponse(userId, subscriptionLevel);
    }

    // 9. Final Response
    return NextResponse.json({
      success: true,
      result: aiResult.result,
      usageStats: {
        hourlyRequestsRemaining: updatedUsageStats.hourlyRequestsRemaining,
        hourlyTokensRemaining: updatedUsageStats.hourlyTokensRemaining,
        hourlyTotalRequests: updatedUsageStats.hourlyTotalRequests,
        hourlyTotalTokens: updatedUsageStats.hourlyTotalTokens,
        tokensUsed: updatedUsageStats.tokensUsed,
        requestsUsed: updatedUsageStats.requestsUsed,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
