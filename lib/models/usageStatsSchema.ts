import mongoose, { Schema, Document } from 'mongoose';

// Usage Stats Interface
export interface IUsageStats extends Document {
  userId: mongoose.Types.ObjectId; // Reference to User model
  hourlyRequestsRemaining: number;
  hourlyTokensRemaining: number;
  hourlyTotalRequests: number;
  hourlyTotalTokens: number;
  lastReset: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Usage Stats Schema
const UsageStatsSchema = new Schema<IUsageStats>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  hourlyRequestsRemaining: {
    type: Number,
    required: true,
    default: 10, // Free tier default
    min: 0
  },
  hourlyTokensRemaining: {
    type: Number,
    required: true,
    default: 100000, // Free tier default (100k tokens)
    min: 0
  },
  hourlyTotalRequests: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  hourlyTotalTokens: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  lastReset: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Index for efficient queries
UsageStatsSchema.index({ userId: 1, lastReset: 1 });

// Export the model
export const UsageStats = mongoose.models.UsageStats || mongoose.model<IUsageStats>('UsageStats', UsageStatsSchema);

// Request Types
export interface UsageStatsUpdateRequest {
  requestCount?: number; // Default: 1
  tokensUsed?: number; // Default: 0
}

// Response Types
export interface UsageStatsGetResponse {
  hourlyRequestsRemaining: number;
  hourlyTokensRemaining: number;
  hourlyTotalRequests: number;
  hourlyTotalTokens: number;
  tokensUsed: number; // Calculated field: hourlyTotalTokens - hourlyTokensRemaining
  lastReset: string; // ISO string
  isPremium: boolean;
}

export interface UsageStatsUpdateResponse {
  success: boolean;
  hourlyRequestsRemaining: number;
  hourlyTokensRemaining: number;
  hourlyTotalRequests: number;
  hourlyTotalTokens: number;
  tokensUsed: number; // Calculated field: hourlyTotalTokens - hourlyTokensRemaining
}

// Error Response Type
export interface UsageStatsErrorResponse {
  error: string;
  code?: string;
}
