import mongoose, { Schema, Document } from 'mongoose';

// Define interfaces for TypeScript
export interface IEvent extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  startDateTime: Date;
  duration: number; // in minutes
  eventType: 'event' | 'meeting' | 'scheduled_post';
  
  // Meeting-specific fields
  attendees?: number;
  location?: string;
  
  // Post reference (only for scheduled_post type)
  sourcePostId?: mongoose.Types.ObjectId;
  
  // Recurring support
  isRecurring: boolean;
  recurrencePattern?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
  };
  
  // Status tracking
  status: 'scheduled' | 'completed' | 'cancelled';
  notificationSent: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

// Event Schema
const EventSchema: Schema<IEvent> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    startDateTime: {
      type: Date,
      required: [true, 'Start date and time is required'],
      index: true,
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [0, 'Duration cannot be negative'],
      default: 60, // Default 1 hour
    },
    eventType: {
      type: String,
      enum: ['event', 'meeting', 'scheduled_post'],
      required: [true, 'Event type is required'],
    },
    
    // Meeting-specific fields
    attendees: {
      type: Number,
      min: [0, 'Attendees cannot be negative'],
      default: 0,
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Location cannot be more than 200 characters'],
    },
    
    // Post reference (only for scheduled_post type)
    sourcePostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      index: true,
    },
    
    // Recurring support
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrencePattern: {
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
      },
      interval: {
        type: Number,
        min: [1, 'Interval must be at least 1'],
        default: 1,
      },
      endDate: {
        type: Date,
      },
    },
    
    // Status tracking
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
EventSchema.index({ userId: 1, startDateTime: 1 });
EventSchema.index({ userId: 1, eventType: 1 });
EventSchema.index({ userId: 1, status: 1 });
EventSchema.index({ startDateTime: 1, notificationSent: 1 });

// Virtual for end date/time
EventSchema.virtual('endDateTime').get(function() {
  return new Date(this.startDateTime.getTime() + this.duration * 60 * 1000);
});

// Virtual for checking if event is in the past
EventSchema.virtual('isPast').get(function() {
  return this.startDateTime < new Date();
});

// Virtual for checking if event is today
EventSchema.virtual('isToday').get(function() {
  const today = new Date();
  const eventDate = new Date(this.startDateTime);
  return (
    eventDate.getDate() === today.getDate() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getFullYear() === today.getFullYear()
  );
});

// Ensure virtuals are included when converting to JSON
EventSchema.set('toJSON', { virtuals: true });

const Event = mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);

export default Event; 