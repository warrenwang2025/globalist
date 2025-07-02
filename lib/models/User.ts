// Location: src/lib/models/User.ts

import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

// Define an interface for a single Login Session
export interface ISession extends Document {
  ipAddress?: string;
  userAgent?: string;
  lastUsedAt: Date;
}

// Define an interface for the User document for TypeScript
export interface IUser extends Document {
  // --- Core Identity & Credentials (from Login/Signup) ---
  email: string;
  name: string;
  password?: string;
  passwordConfirm?: string; // For password confirmation during signup

  profilePicture: string;
  bio?: string;
  location?: string;
  phone?: string;

  // --- Account Stats (from the UI) ---
  contentCreatedCount: number;
  aiGenerationsCount: number;

  // --- Security (from the UI) ---
  passwordChangedAt?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  sessions: ISession[];

  // --- Other Important Fields ---
  userSubscriptionLevel: 'free' | 'plus' | 'pro'; // For future subscription plans
  isActive: boolean; // For soft-deleting an account
  planExpiresAt?: Date; // For subscription expiration
  createdAt: Date; // Handled by timestamps
  updatedAt: Date; // Handled by timestamps
}

// Sub-schema for login sessions
const SessionSchema: Schema = new Schema({
  ipAddress: String,
  userAgent: String,
  lastUsedAt: { type: Date, default: Date.now },
});

const UserSchema: Schema<IUser> = new Schema(
  {
    // --- Core Identity & Credentials ---
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => validator.isEmail(value),
        message: 'Invalid email format.',
      }
    },
    name: {
      type: String,
      required: [true, 'Name is required.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      select: false, // NEVER return the password by default
      validate: {
        validator: (value: string) => validator.isStrongPassword(value, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        }),
        message: 'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one symbol.',
      }
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Password confirmation is required.'], 
        validate: {
          // This only works on CREATE and SAVE, not on UPDATE
          validator: function (this: IUser, value: string) {
            return value === this.password;
          },
          message: 'Passwords do not match.',
        },
    },
    // --- Profile Information ---
    profilePicture: {
      type: String,
      default: '/default-user-profile-picture.webp', // A default image path
    },
    bio: {
      type: String,
      maxlength: [250, 'Bio cannot be more than 250 characters.'],
    },
    location: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: (value: string) => !value || validator.isMobilePhone(value, 'any', { strictMode: false }),
        message: 'Please provide a valid phone number.',
      },
    },

    // --- Account Stats ---
    contentCreatedCount: {
      type: Number,
      default: 0,
    },
    aiGenerationsCount: {
      type: Number,
      default: 0,
    },

    // --- Security ---
    passwordChangedAt: Date,
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false, // Also a secret, hide it by default
    },
    sessions: [SessionSchema],

    // --- Other Important Fields ---
    userSubscriptionLevel: {
      type: String,
      enum: ['free', 'plus', 'pro'],
      default: 'free',
    },
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    planExpiresAt: {
      type: Date
    }
  },
  {
    // Automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

// This is the crucial part for Next.js to prevent model re-definition
UserSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with a cost of 12
  this.password = await bcrypt.hash(this.password!, 12);

  // Delete the passwordConfirm field so it's not saved to the DB
  this.passwordConfirm = undefined;

  next();
});

// This middleware updates the passwordChangedAt field
UserSchema.pre('save', function (next) {
  // If the password wasn't modified or if this is a new document, don't do anything
  if (!this.isModified('password') || this.isNew) return next();

  // We subtract 1 second to ensure the token is created AFTER the password is changed
  this.passwordChangedAt = new Date(Date.now() - 1000); 
  next();
});


UserSchema.methods.comparePassword = async function (
  userEnteredPassword: string,
  actualPassword: string
): Promise<boolean> {
    console.log('Comparing passwords:', userEnteredPassword, actualPassword);
  return await bcrypt.compare(userEnteredPassword, actualPassword);
};

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;