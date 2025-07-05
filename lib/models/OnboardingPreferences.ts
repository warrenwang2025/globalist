import mongoose, { Schema, Document } from "mongoose";

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

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

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
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create indexes for better query performance
OnboardingPreferencesSchema.index({ userType: 1 });

// Export the model
const OnboardingPreferences =
  mongoose.models.OnboardingPreferences ||
  mongoose.model<IOnboardingPreferences>(
    "OnboardingPreferences",
    OnboardingPreferencesSchema
  );

export default OnboardingPreferences;
