import dbConnect from '@/lib/dbConnect';
import { UsageStats, type IUsageStats } from '@/lib/models/usageStatsSchema';

// Rate limits constants
const RATE_LIMITS = {
  FREE_HOURLY_LIMIT: parseInt(process.env.FREE_HOURLY_LIMIT || '10'),
  PLUS_HOURLY_LIMIT: parseInt(process.env.PLUS_HOURLY_LIMIT || '50'),
  PRO_HOURLY_LIMIT: parseInt(process.env.PRO_HOURLY_LIMIT || '200'),
  
  FREE_HOURLY_TOKENS: parseInt(process.env.FREE_HOURLY_TOKENS || '100000'), // 100k tokens
  PLUS_HOURLY_TOKENS: parseInt(process.env.PLUS_HOURLY_TOKENS || '500000'), // 500k tokens
  PRO_HOURLY_TOKENS: parseInt(process.env.PRO_HOURLY_TOKENS || '2000000'), // 2M tokens
  
  RESET_INTERVAL_MS: parseInt(process.env.RESET_INTERVAL_MS || '3600000'), // 1 hour
};

export class UsageStatsService {
  /**
   * Get hourly request limit based on subscription level
   */
  private static getHourlyRequestLimit(subscriptionLevel: string): number {
    switch (subscriptionLevel) {
      case 'plus':
        return RATE_LIMITS.PLUS_HOURLY_LIMIT;
      case 'pro':
        return RATE_LIMITS.PRO_HOURLY_LIMIT;
      default:
        return RATE_LIMITS.FREE_HOURLY_LIMIT;
    }
  }

  /**
   * Get hourly token limit based on subscription level
   */
  private static getHourlyTokenLimit(subscriptionLevel: string): number {
    switch (subscriptionLevel) {
      case 'plus':
        return RATE_LIMITS.PLUS_HOURLY_TOKENS;
      case 'pro':
        return RATE_LIMITS.PRO_HOURLY_TOKENS;
      default:
        return RATE_LIMITS.FREE_HOURLY_TOKENS;
    }
  }

  /**
   * Check if hourly reset is needed
   */
  private static isResetNeeded(lastReset: Date): boolean {
    const now = new Date();
    const timeSinceReset = now.getTime() - lastReset.getTime();
    return timeSinceReset >= RATE_LIMITS.RESET_INTERVAL_MS;
  }

  /**
   * Find usage stats by user ID
   */
  private static async findByUserId(userId: string): Promise<IUsageStats | null> {
    await dbConnect();
    return await UsageStats.findOne({ userId });
  }

  /**
   * Create new usage stats for user
   */
  private static async createUsageStats(userId: string, subscriptionLevel: string): Promise<IUsageStats> {
    await dbConnect();
    
    const hourlyLimit = this.getHourlyRequestLimit(subscriptionLevel);
    const hourlyTokenLimit = this.getHourlyTokenLimit(subscriptionLevel);
    const newStats = new UsageStats({
      userId,
      hourlyRequestsRemaining: hourlyLimit,
      hourlyTokensRemaining: hourlyTokenLimit,
      hourlyTotalRequests: hourlyLimit,
      hourlyTotalTokens: hourlyTokenLimit,
      lastReset: new Date()
    });
    
    return await newStats.save();
  }

  /**
   * Reset hourly limits for user
   */
  private static async resetHourlyLimits(userId: string, subscriptionLevel: string): Promise<IUsageStats | null> {
    await dbConnect();
    
    const hourlyLimit = this.getHourlyRequestLimit(subscriptionLevel);
    const hourlyTokenLimit = this.getHourlyTokenLimit(subscriptionLevel);
    const now = new Date();
    
    return await UsageStats.findOneAndUpdate(
      { userId },
      {
        hourlyRequestsRemaining: hourlyLimit,
        hourlyTokensRemaining: hourlyTokenLimit,
        lastReset: now,
        updatedAt: now
      },
      { new: true }
    );
  }



  /**
   * Get usage stats response for API
   */
  public static async getUsageStatsResponse(userId: string, subscriptionLevel: string) {
    const userStats = await this.getUserStatsWithAutoReset(userId, subscriptionLevel);
    
    return {
      hourlyRequestsRemaining: userStats.hourlyRequestsRemaining,
      hourlyTokensRemaining: userStats.hourlyTokensRemaining,
      hourlyTotalRequests: userStats.hourlyTotalRequests,
      hourlyTotalTokens: userStats.hourlyTotalTokens,
      tokensUsed: userStats.hourlyTotalTokens - userStats.hourlyTokensRemaining,
      requestsUsed: userStats.hourlyTotalRequests - userStats.hourlyRequestsRemaining,
      lastReset: userStats.lastReset.toISOString(),
      isPremium: subscriptionLevel !== 'free'
    };
  }

  /**
   * Update usage stats (decrement requests, add tokens)
   */
  public static async updateUsageStats(
    userId: string, 
    requestCount: number = 1, 
    tokensUsed: number
  ): Promise<IUsageStats | null> {
    await dbConnect();
    
    const now = new Date();
    
    // First get current stats to calculate new values
    const currentStats = await UsageStats.findOne({ userId });
    if (!currentStats) {
      throw new Error('Usage stats not found for user');
    }
    
    // Calculate new remaining values (ensure they don't go below 0)
    const newRequestsRemaining = Math.max(0, currentStats.hourlyRequestsRemaining - requestCount);
    const newTokensRemaining = Math.max(0, currentStats.hourlyTokensRemaining - tokensUsed);
    
    return await UsageStats.findOneAndUpdate(
      { userId },
      {
        $set: {
          hourlyRequestsRemaining: newRequestsRemaining,
          hourlyTokensRemaining: newTokensRemaining,
          updatedAt: now
        }
      },
      { new: true }
    );
  }

  /**
   * Check if user has remaining requests and tokens
   */
  public static async checkRateLimit(userId: string, subscriptionLevel: string): Promise<{ hasRequests: boolean; hasTokens: boolean; canProceed: boolean }> {
    const userStats = await this.getUserStatsWithAutoReset(userId, subscriptionLevel);
    
    // Check both request and token limits
    const hasRequests = userStats.hourlyRequestsRemaining > 0;
    const hasTokens = userStats.hourlyTokensRemaining > 0;
    
    return {
      hasRequests,
      hasTokens,
      canProceed: hasRequests && hasTokens
    };
  }

  /**
   * Get user stats with auto-reset if needed
   */
  private static async getUserStatsWithAutoReset(userId: string, subscriptionLevel: string): Promise<IUsageStats> {
    // First get user stats
    let userStats = await this.findByUserId(userId);
    
    if (!userStats) {
      // Create new usage stats if user doesn't exist
      userStats = await this.createUsageStats(userId, subscriptionLevel);
    } else if (this.isResetNeeded(userStats.lastReset)) {
      // Reset if needed
      userStats = await this.resetHourlyLimits(userId, subscriptionLevel);
      if (!userStats) {
        throw new Error('Failed to reset usage stats');
      }
    }
    
    return userStats;
  }


  /**
   * Check if user can proceed with an AI request (token-only check)
   * Returns true if user has enough tokens remaining
   */
  public static async canUserProceed(
    userId: string,
    subscriptionLevel: string,
    estimatedTokens: number
  ): Promise<boolean> {
    const userStats = await this.getUserStatsWithAutoReset(userId, subscriptionLevel);
    return userStats.hourlyTokensRemaining >= estimatedTokens;
  }
}
