import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { aiService } from '@/lib/services/aiService';
import { UsageStatsService } from '@/lib/services/usageStatsService';
import { TokenEstimationService } from '@/lib/services/tokenEstimationService';
import { AIRequestValidator } from '@/lib/services/aiRequestValidator';
import type { AIRequest, AIResponse } from '@/types/ai';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const subscriptionLevel = (session.user as any).subscriptionLevel || 'free';

    const requestsLeft = (await UsageStatsService.checkRateLimit(userId,subscriptionLevel)).canProceed; // Check if requests or tokens are zero

    if (!requestsLeft) {
      return NextResponse.json(
        { success: false, error: 'Hourly request limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const body: AIRequest = await request.json();
    
    // Validate the request and format content for token estimation
    const validation = AIRequestValidator.validateAIRequest(body);
    
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    const { toolType, tone, contentFromFrontend } = validation;

    // Estimate token usage (user pays for their content only)
    const estimatedTokens = TokenEstimationService.estimateUserTokensOnly(
      toolType!,
      AIRequestValidator.formatContentForTokenEstimation(contentFromFrontend!)
    );

    // Check if user can proceed based on token limits BEFORE processing
    const canProceed = await UsageStatsService.canUserProceed(
      userId,
      subscriptionLevel,
      estimatedTokens
    );

    if (!canProceed) {
      // Get current stats for detailed error message
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
            requestsUsed: currentStats.requestsUsed
          },
          estimatedTokens
        },
        { status: 429 }
      );
    }


    // Process AI request
    const result = await aiService.processRequest({
      toolType: toolType! as any,
      tone: tone! as any,
      prompt: typeof contentFromFrontend === 'string' ? contentFromFrontend : undefined,
      contentBlocks: Array.isArray(contentFromFrontend) ? contentFromFrontend : undefined,
      rawContent: typeof contentFromFrontend === 'string' && (toolType === 'summarize') ? contentFromFrontend : undefined
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    // Update usage stats with actual tokens used
    let updatedUsageStats;
    try {
      // Determine tokens to charge the user
      const tokensToCharge = result.usage?.totalTokens 
        ? TokenEstimationService.calculateUserTokensUsed(result.usage.totalTokens, toolType!)
        : estimatedTokens;

      if (!result.usage?.totalTokens) {
        console.warn('No token usage info in AI response, using estimated tokens:', estimatedTokens);
      }

      // Update usage stats and get formatted response
      await UsageStatsService.updateUsageStats(userId, 1, tokensToCharge);
      updatedUsageStats = await UsageStatsService.getUsageStatsResponse(userId, subscriptionLevel);
      
    } catch (usageError) {
      console.error('Failed to update usage stats:', usageError);
      // If update fails, try to get current stats for response
      try {
        updatedUsageStats = await UsageStatsService.getUsageStatsResponse(userId, subscriptionLevel);
      } catch (getStatsError) {
        console.error('Failed to get current usage stats:', getStatsError);
        // Return safe defaults if everything fails
        updatedUsageStats = {
          hourlyRequestsRemaining: 0,
          hourlyTokensRemaining: 0,
          hourlyTotalRequests: 0,
          hourlyTotalTokens: 0,
          tokensUsed: 0,
          requestsUsed: 0
        };
      }
    }

    const response: AIResponse = {
      success: true,
      suggestions: result.suggestions,
      enhancedBlocks: result.enhancedBlocks,
      usageStats: {
        hourlyRequestsRemaining: updatedUsageStats.hourlyRequestsRemaining,
        hourlyTokensRemaining: updatedUsageStats.hourlyTokensRemaining,
        hourlyTotalRequests: updatedUsageStats.hourlyTotalRequests,
        hourlyTotalTokens: updatedUsageStats.hourlyTotalTokens,
        tokensUsed: updatedUsageStats.tokensUsed,
        requestsUsed: updatedUsageStats.requestsUsed
      }
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('AI API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
