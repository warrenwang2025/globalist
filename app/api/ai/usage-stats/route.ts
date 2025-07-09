export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { UsageStatsService } from '@/lib/services/usageStatsService';
import type { 
  UsageStatsGetResponse, 
  UsageStatsErrorResponse 
} from '@/lib/models/usageStatsSchema';

export async function GET(request: NextRequest): Promise<NextResponse<UsageStatsGetResponse | UsageStatsErrorResponse>> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json<UsageStatsErrorResponse>(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const subscriptionLevel = (session.user as any).subscriptionLevel || 'free';
    
    // Use service to get usage stats response with auto-reset
    const response = await UsageStatsService.getUsageStatsResponse(userId, subscriptionLevel);
    
    return NextResponse.json<UsageStatsGetResponse>(response);
    
  } catch (error) {
    console.error('Usage stats error:', error);
    return NextResponse.json<UsageStatsErrorResponse>(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
