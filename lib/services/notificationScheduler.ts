import Event from '@/lib/models/Event';
import Post from '@/lib/models/Post';
import Notification from '@/lib/models/Notification';
import UserSettings from '@/lib/models/UserSettings';
import User from '@/lib/models/User';
import emailService from './emailService';
import dbConnect from '@/lib/dbConnect';

class NotificationScheduler {
  // Process pending notifications
  async processPendingNotifications(): Promise<void> {
    try {
      await dbConnect();
      
      const now = new Date();
      const pendingNotifications = await Notification.find({
        status: 'pending',
        scheduledFor: { $lte: now },
      }).populate('userId').populate('relatedEventId').populate('relatedPostId');

      for (const notification of pendingNotifications) {
        try {
          await this.sendNotification(notification);
          
          // Update notification status
          await Notification.findByIdAndUpdate(notification._id, {
            status: 'sent',
            sentAt: new Date(),
          });
          
        } catch (error) {
          console.error(`Failed to send notification ${notification._id}:`, error);
          
          // Update notification status to failed
          await Notification.findByIdAndUpdate(notification._id, {
            status: 'failed',
            sentAt: new Date(),
          });
        }
      }
    } catch (error) {
      console.error('Error processing pending notifications:', error);
    }
  }

  // Send a single notification
  private async sendNotification(notification: any): Promise<void> {
    const user = notification.userId;
    if (!user) {
      throw new Error('User not found');
    }

    // Get user notification preferences
    const userSettings = await UserSettings.findOne({ userId: user._id });
    const preferences = userSettings?.notifications?.calendarNotifications;

    let emailSent = false;
    let pushSent = false;

    // Send email notification if enabled
    if (notification.type === 'event_reminder' && preferences?.events?.emailReminder) {
      if (notification.relatedEventId) {
        emailSent = await emailService.sendEventReminder(notification.relatedEventId, user);
      }
    } else if (notification.type === 'meeting_reminder' && preferences?.meetings?.emailReminder) {
      if (notification.relatedEventId) {
        emailSent = await emailService.sendEventReminder(notification.relatedEventId, user);
      }
    } else if (notification.type === 'post_scheduled' && preferences?.scheduledPosts?.emailReminder) {
      if (notification.relatedEventId && notification.relatedPostId) {
        emailSent = await emailService.sendPostScheduledNotification(
          notification.relatedEventId,
          user,
          notification.relatedPostId
        );
      }
    } else if (notification.type === 'post_published' || notification.type === 'post_failed') {
      if (notification.relatedPostId) {
        emailSent = await emailService.sendPostStatusNotification(
          notification.relatedPostId,
          user,
          notification.type === 'post_published' ? 'published' : 'failed'
        );
      }
    }

    // TODO: Implement push notifications
    // pushSent = await this.sendPushNotification(notification);

    // Update notification with delivery status
    await Notification.findByIdAndUpdate(notification._id, {
      emailSent,
      pushSent,
    });
  }

  // Create notifications for upcoming events
  async createEventNotifications(): Promise<void> {
    try {
      await dbConnect();
      
      const now = new Date();
      const futureDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Next 24 hours

      // Find events that need notifications
      const events = await Event.find({
        startDateTime: { $gte: now, $lte: futureDate },
        notificationSent: false,
        status: 'scheduled',
      }).populate('userId');

      for (const event of events) {
        await this.createEventNotification(event);
      }
    } catch (error) {
      console.error('Error creating event notifications:', error);
    }
  }

  // Create notification for a specific event
  private async createEventNotification(event: any): Promise<void> {
    try {
      const user = event.userId;
      if (!user) return;

      // Get user notification preferences
      const userSettings = await UserSettings.findOne({ userId: user._id });
      const preferences = userSettings?.notifications?.calendarNotifications;

      if (!preferences) return;

      let reminderTime = 15; // Default 15 minutes
      let notificationType = 'event_reminder';

      // Get reminder time based on event type
      if (event.eventType === 'meeting') {
        reminderTime = preferences.meetings?.reminderTime || 30;
        notificationType = 'meeting_reminder';
      } else if (event.eventType === 'scheduled_post') {
        reminderTime = preferences.scheduledPosts?.reminderTime || 5;
        notificationType = 'post_scheduled';
      } else {
        reminderTime = preferences.events?.reminderTime || 15;
      }

      // Calculate notification time
      const notificationTime = new Date(event.startDateTime.getTime() - reminderTime * 60 * 1000);
      
      // Only create notification if it's in the future
      if (notificationTime > new Date()) {
        const notificationData: any = {
          userId: user._id,
          type: notificationType,
          title: `Reminder: ${event.title}`,
          message: `${event.title} starts in ${reminderTime} minutes`,
          relatedEventId: event._id,
          scheduledFor: notificationTime,
        };

        // Add post reference for scheduled posts
        if (event.eventType === 'scheduled_post' && event.sourcePostId) {
          notificationData.relatedPostId = event.sourcePostId;
        }

        await Notification.create(notificationData);
      }

      // Mark event as notified
      await Event.findByIdAndUpdate(event._id, { notificationSent: true });

    } catch (error) {
      console.error('Error creating event notification:', error);
    }
  }

  // Create post publishing notifications
  async createPostNotifications(): Promise<void> {
    try {
      await dbConnect();
      
      const now = new Date();
      const pastDate = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes ago

      // Find posts that were scheduled to be published recently
      const posts = await Post.find({
        status: 'scheduled',
        scheduledDate: { $gte: pastDate, $lte: now },
      }).populate('userId');

      for (const post of posts) {
        await this.createPostNotification(post);
      }
    } catch (error) {
      console.error('Error creating post notifications:', error);
    }
  }

  // Create notification for a specific post
  private async createPostNotification(post: any): Promise<void> {
    try {
      const user = post.userId;
      if (!user) return;

      // Create immediate notification for post publishing
      const notificationData = {
        userId: user._id,
        type: 'post_published' as const,
        title: `Post Published: ${post.title}`,
        message: `Your post "${post.title}" has been published`,
        relatedPostId: post._id,
        scheduledFor: new Date(),
      };

      await Notification.create(notificationData);

      // Update post status (this would be handled by the publishing service)
      // For now, we'll just mark it as published
      await Post.findByIdAndUpdate(post._id, { 
        status: 'published',
        publishedDate: new Date(),
      });

    } catch (error) {
      console.error('Error creating post notification:', error);
    }
  }

  // Send weekly digest
  async sendWeeklyDigest(): Promise<void> {
    try {
      await dbConnect();
      
      const users = await User.find({ isActive: true });
      
      for (const user of users) {
        const userSettings = await UserSettings.findOne({ userId: user._id });
        
        // Check if user has weekly digest enabled
        if (userSettings?.notifications?.weeklyDigest) {
          // Get user's events and posts for the week
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          
          const events = await Event.find({
            userId: user._id,
            startDateTime: { $gte: weekAgo, $lte: weekFromNow },
          });
          
          const posts = await Post.find({
            userId: user._id,
            createdAt: { $gte: weekAgo },
          });
          
          // Send digest
          await emailService.sendWeeklyDigest(user, events, posts);
        }
      }
    } catch (error) {
      console.error('Error sending weekly digest:', error);
    }
  }

  // Clean up old notifications
  async cleanupOldNotifications(): Promise<void> {
    try {
      await dbConnect();
      
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      // Delete notifications older than 30 days
      await Notification.deleteMany({
        createdAt: { $lt: thirtyDaysAgo },
        status: { $in: ['sent', 'failed'] },
      });
      
      console.log('Cleaned up old notifications');
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
    }
  }
}

// Create singleton instance
const notificationScheduler = new NotificationScheduler();

export default notificationScheduler; 