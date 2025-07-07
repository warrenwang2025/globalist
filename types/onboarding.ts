// Simple types for onboarding data

export type UserType =
  | "enterprise"
  | "marketing agency"
  | "content creator"
  | "digital marketer"
  | "media company";

export type ExperienceLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

export type InterestType =
  | "social-media"
  | "video-content"
  | "visual-design"
  | "analytics-insights"
  | "community management"
  | "news-media"
  | "entertainment"
  | "gaming"
  | "ecommerce"
  | "b2b-marketing"
  | "lifestyle-wellness"
  | "global-markets";

export type GoalType =
  | "increase-engagement"
  | "grow-audience"
  | "improve-roi"
  | "save-time"
  | "optimize-performance"
  | "brand-consistency"
  | "global-expansion"
  | "content-strategy";

export type IntegrationType =
  | "X"
  | "linkedin"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "facebook"
  | "wordpress";

// Main onboarding data structure
export interface OnboardingData {
  userType: UserType;
  interests: InterestType[];
  goals: GoalType[];
  experience: ExperienceLevel;
  preferences: {
    notifications?: boolean;
    emailUpdates?: boolean;
    darkMode?: boolean;
    timezone?: string;
    language?: string;
    weekStart?: 'monday' | 'sunday';
  };
  integrations?: IntegrationType[];
}
