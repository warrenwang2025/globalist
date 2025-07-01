import mongoose, { Schema, Document } from "mongoose";

// Define interfaces for nested objects
export interface INotificationPreferences {
  notifications: boolean;
  emailUpdates: boolean;
  marketingEmails?: boolean;
  weeklyReports?: boolean;
}

export interface ILocalizationPreferences {
  language: string;
  timezone: string;
  weekStart: "monday" | "sunday";
}

export interface IUIPreferences {
  darkMode: boolean;
}

// Main OnboardingPreferences interface
export interface IOnboardingPreferences extends Document {
  userId: mongoose.Types.ObjectId;

  // Core onboarding data
  userType:
    | "enterprise"
    | "marketing agency"
    | "content creator"
    | "digital marketer"
    | "media company";
  interests: string[]; // Array of interest IDs
  goals: string[]; // Array of goal IDs
  experience: "beginner" | "intermediate" | "advanced" | "expert";

  // Detailed preferences
  notifications: INotificationPreferences;
  localization: ILocalizationPreferences;
  ui: IUIPreferences;

  // Platform integrations
  integrationsEnabled: string[];

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// Notification preferences sub-schema
const NotificationPreferencesSchema = new Schema(
  {
    notifications: { type: Boolean, default: true },
    emailUpdates: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false },
    weeklyReports: { type: Boolean, default: true },
  },
  { _id: false }
);

// Localization preferences sub-schema
const LocalizationPreferencesSchema = new Schema(
  {
    language: { type: String, default: "en" },
    timezone: { type: String, default: "UTC" },
    weekStart: { type: String, enum: ["monday", "sunday"], default: "monday" },
  },
  { _id: false }
);


// UI preferences sub-schema
const UIPreferencesSchema = new Schema(
  {
    darkMode: { type: Boolean, default: false },
  },
  { _id: false }
);


// Main OnboardingPreferences Schema
const OnboardingPreferencesSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One preferences document per user
    },

    // Core onboarding data
    userType: {
      type: String,
      enum: [
        "enterprise",
        "marketing agency",
        "content creator",
        "digital marketer",
        "media company",
      ],
      required: true,
    },
    interests: [
      {
        type: String,
        enum: [
          "social-media",
          "video-content",
          "visual-design",
          "analytics-insights",
          "community management",
          "news-media",
          "entertainment",
          "gaming",
          "ecommerce",
          "b2b-marketing",
          "lifestyle-wellness",
          "global-markets",
        ],
      },
    ],
    goals: [
      {
        type: String,
        enum: [
          "increase-engagement",
          "grow-audience",
          "improve-roi",
          "save-time",
          "optimize-performance",
          "brand-consistency",
          "global-expansion",
          "content-strategy",
        ],
      },
    ],
    experience: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "expert"],
      required: true,
    },

    // Detailed preferences
    notifications: { type: NotificationPreferencesSchema, default: {} },
    localization: { type: LocalizationPreferencesSchema, default: {} },
    ui: { type: UIPreferencesSchema, default: {} },

    // Platform integrations
    integrationsEnabled: [
      {
        type: String,
        enum: [
            "X",
            "linkedin",
            "instagram",
            "tiktok",
            "youtube",
          "facebook",
          "wordpress"
        ],
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create indexes for better query performance
OnboardingPreferencesSchema.index({ userId: 1 });
OnboardingPreferencesSchema.index({ userType: 1 });

// Export the model
const OnboardingPreferences =
  mongoose.models.OnboardingPreferences ||
  mongoose.model<IOnboardingPreferences>(
    "OnboardingPreferences",
    OnboardingPreferencesSchema
  );

export default OnboardingPreferences;
