import mongoose, { Schema, Document } from 'mongoose';

// Define interfaces for TypeScript
export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'event_reminder' | 'post_scheduled' | 'post_published' | 'post_failed' | 'meeting_reminder';
  title: string;
  message: string;
  relatedEventId?: mongoose.Types.ObjectId;
  relatedPostId?: mongoose.Types.ObjectId;
  scheduledFor: Date;
  sentAt?: Date;
  status: 'pending' | 'sent' | 'failed';
  emailSent: boolean;
  pushSent: boolean;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Notification Schema
const NotificationSchema: Schema<INotification> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['event_reminder', 'post_scheduled', 'post_published', 'post_failed', 'meeting_reminder'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    message: {
      type: String,
      required: true,
      maxlength: [1000, 'Message cannot be more than 1000 characters'],
    },
    relatedEventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      index: true,
    },
    relatedPostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      index: true,
    },
      scheduledFor: {
    type: Date,
    required: true,
    index: true,
    comment: 'When this notification should be sent (for scheduled notifications)',
  },
    sentAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
    },
    emailSent: {
      type: Boolean,
      default: false,
    },
    pushSent: {
      type: Boolean,
      default: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
NotificationSchema.index({ userId: 1, status: 1 });
NotificationSchema.index({ userId: 1, read: 1 });
NotificationSchema.index({ scheduledFor: 1, status: 1 });
NotificationSchema.index({ userId: 1, createdAt: -1 });

// Virtual for checking if notification is overdue
NotificationSchema.virtual('isOverdue').get(function() {
  return this.status === 'pending' && this.scheduledFor < new Date();
});

// Ensure virtuals are included when converting to JSON
NotificationSchema.set('toJSON', { virtuals: true });

const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification; 