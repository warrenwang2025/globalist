import nodemailer from 'nodemailer';
import { IEvent } from '@/lib/models/Event';
import { IPost } from '@/lib/models/Post';
import { IUser } from '@/lib/models/User';
import { EmailTemplates } from '@/lib/templates/emailTemplates';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Create transporter based on environment
    if (process.env.NODE_ENV === 'production') {
      // Production: Use real SMTP service
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else {
      // Development: Use Mailtrap or similar
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT!),
        secure: false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
  }

  // Send event reminder email
  async sendEventReminder(event: IEvent, user: IUser, reminderTime: number=15): Promise<boolean> {
    try {
      const template = EmailTemplates.getEventReminderTemplate({
        event,
        user,
        reminderTime,
      });

      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@mediasuite.com',
        to: user.email,
        subject: template.subject,
        html: template.html,
      });

      return true;
    } catch (error) {
      console.error('Error sending event reminder email:', error);
      return false;
    }
  }

  // Send post scheduling confirmation
  async sendPostScheduledNotification(event: IEvent, user: IUser, post: IPost): Promise<boolean> {
    try {
      const platformNames = post.platforms.map(platform => {
        const platformMap: { [key: string]: string } = {
          'facebook': 'Facebook',
          'twitter': 'Twitter',
          'linkedin': 'LinkedIn',
          'instagram': 'Instagram',
          'youtube': 'YouTube',
          'tiktok': 'TikTok',
        };
        return platformMap[platform] || platform;
      }).join(', ');

      const template = EmailTemplates.getPostScheduledTemplate({
        event,
        post,
        user,
        platformNames,
      });

      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: template.subject,
        html: template.html,
      });

      return true;
    } catch (error) {
      console.error('Error sending post scheduled notification:', error);
      return false;
    }
  }

  // Send post publishing status
  async sendPostStatusNotification(post: IPost, user: IUser, status: 'published' | 'failed'): Promise<boolean> {
    try {
      const platformNames = post.platforms.map(platform => {
        const platformMap: { [key: string]: string } = {
          'facebook': 'Facebook',
          'twitter': 'Twitter',
          'linkedin': 'LinkedIn',
          'instagram': 'Instagram',
          'youtube': 'YouTube',
          'tiktok': 'TikTok',
        };
        return platformMap[platform] || platform;
      }).join(', ');

      const template = EmailTemplates.getPostStatusTemplate({
        post,
        user,
        platformNames,
      }, status);

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@mediasuite.com',
        to: user.email,
        subject: template.subject,
        html: template.html,
      });

      return true;
    } catch (error) {
      console.error('Error sending post status notification:', error);
      return false;
    }
  }

  // Send weekly digest
  async sendWeeklyDigest(user: IUser, events: IEvent[], posts: IPost[]): Promise<boolean> {
    try {
      const template = EmailTemplates.getWeeklyDigestTemplate({
        user,
      }, events, posts);

      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@mediasuite.com',
        to: user.email,
        subject: template.subject,
        html: template.html,
      });

      return true;
    } catch (error) {
      console.error('Error sending weekly digest:', error);
      return false;
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(user: IUser, resetUrl: string): Promise<boolean> {
    try {
      const template = EmailTemplates.getPasswordResetTemplate({
        user,
        resetUrl,
      });

      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@mediasuite.com',
        to: user.email,
        subject: template.subject,
        html: template.html,
      });

      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return false;
    }
  }

}

// Create singleton instance
const emailService = new EmailService();

export default emailService; 