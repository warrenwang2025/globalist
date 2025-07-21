import { IEvent } from '@/lib/models/Event';
import { IPost } from '@/lib/models/Post';
import { IUser } from '@/lib/models/User';

export interface EmailTemplateData {
  event?: IEvent;
  post?: IPost;
  user: IUser;
  reminderTime?: number;
  platformNames?: string;
  resetUrl?: string;
}

export class EmailTemplates {
  // Event reminder template
  static getEventReminderTemplate(data: EmailTemplateData): { subject: string; html: string } {
    const { event, user, reminderTime } = data;
    if (!event) throw new Error('Event is required for event reminder template');

    const eventDate = new Date(event.startDateTime);
    const formattedDate = eventDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const subject = `Reminder: ${event.title}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Event Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .event-card { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .event-title { color: #007bff; font-size: 24px; margin: 0 0 15px 0; }
          .event-details { margin: 15px 0; }
          .event-details strong { color: #555; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .reminder-badge { background: #ff6b6b; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📅 Event Reminder</h1>
            <p>Your event starts in ${reminderTime} minutes</p>
          </div>
          
          <div class="content">
            <div class="reminder-badge">⏰ ${reminderTime} minutes until start</div>
            
            <div class="event-card">
              <h2 class="event-title">${event.title}</h2>
              ${event.description ? `<p style="color: #666; margin-bottom: 20px;">${event.description}</p>` : ''}
              
              <div class="event-details">
                <strong>📅 Date:</strong> ${formattedDate}<br>
                <strong>🕐 Time:</strong> ${formattedTime}<br>
                <strong>⏱️ Duration:</strong> ${event.duration} minutes<br>
                ${event.location ? `<strong>📍 Location:</strong> ${event.location}<br>` : ''}
                ${event.attendees ? `<strong>👥 Attendees:</strong> ${event.attendees} people<br>` : ''}
                <strong>📋 Type:</strong> ${event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)}<br>
              </div>
            </div>
            
            <div class="footer">
              <p>This is an automated reminder from your Media Suite calendar.</p>
              <p>© 2024 Media Suite. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return { subject, html };
  }

  // Post scheduled confirmation template
  static getPostScheduledTemplate(data: EmailTemplateData): { subject: string; html: string } {
    const { event, post, user, platformNames } = data;
    if (!event || !post) throw new Error('Event and post are required for post scheduled template');

    const postDate = new Date(event.startDateTime);
    const formattedDate = postDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const formattedTime = postDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const subject = `Post Scheduled: ${post.title}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Post Scheduled</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .post-card { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .post-title { color: #28a745; font-size: 24px; margin: 0 0 15px 0; }
          .post-content { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; font-style: italic; }
          .post-details { margin: 15px 0; }
          .post-details strong { color: #555; }
          .platforms { display: flex; flex-wrap: wrap; gap: 10px; margin: 15px 0; }
          .platform-badge { background: #007bff; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .success-badge { background: #28a745; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📝 Post Scheduled Successfully</h1>
            <p>Your content is ready to be published</p>
          </div>
          
          <div class="content">
            <div class="success-badge">✅ Scheduled for Publication</div>
            
            <div class="post-card">
              <h2 class="post-title">${post.title}</h2>
              
              <div class="post-content">
                ${post.contentText || 'Your post content'}
              </div>
              
              <div class="post-details">
                <strong>📅 Scheduled for:</strong> ${formattedDate} at ${formattedTime}<br>
                <strong>📱 Platforms:</strong> ${platformNames || 'Multiple platforms'}<br>
                ${post.mediaFiles.length > 0 ? `<strong>📎 Media files:</strong> ${post.mediaFiles.length} attached<br>` : ''}
                <strong>📊 Status:</strong> Scheduled<br>
              </div>
              
              <div class="platforms">
                ${post.platforms.map(platform => `<span class="platform-badge">${platform}</span>`).join('')}
              </div>
            </div>
            
            <div class="footer">
              <p>Your post will be published automatically at the specified time.</p>
              <p>© 2024 Media Suite. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return { subject, html };
  }

  // Post status notification template
  static getPostStatusTemplate(data: EmailTemplateData, status: 'published' | 'failed'): { subject: string; html: string } {
    const { post, user, platformNames } = data;
    if (!post) throw new Error('Post is required for post status template');

    const statusColor = status === 'published' ? '#28a745' : '#dc3545';
    const statusText = status === 'published' ? 'Successfully Published' : 'Failed to Publish';
    const statusIcon = status === 'published' ? '✅' : '❌';

    const subject = `Post ${status === 'published' ? 'Published' : 'Failed'}: ${post.title}`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Post ${status === 'published' ? 'Published' : 'Failed'}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, ${statusColor} 0%, ${status === 'published' ? '#20c997' : '#e74c3c'} 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .post-card { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .post-title { color: ${statusColor}; font-size: 24px; margin: 0 0 15px 0; }
          .post-content { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; font-style: italic; }
          .post-details { margin: 15px 0; }
          .post-details strong { color: #555; }
          .status-badge { background: ${statusColor}; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block; margin-bottom: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .error-message { background: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #f5c6cb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${statusIcon} Post ${status === 'published' ? 'Published' : 'Failed'}</h1>
            <p>${status === 'published' ? 'Your content has been successfully published' : 'There was an issue publishing your content'}</p>
          </div>
          
          <div class="content">
            <div class="status-badge">${statusIcon} ${statusText}</div>
            
            <div class="post-card">
              <h2 class="post-title">${post.title}</h2>
              
              <div class="post-content">
                ${post.contentText || 'Your post content'}
              </div>
              
              <div class="post-details">
                <strong>📱 Platforms:</strong> ${platformNames || 'Multiple platforms'}<br>
                <strong>🕐 Published at:</strong> ${new Date().toLocaleString()}<br>
                ${post.mediaFiles.length > 0 ? `<strong>📎 Media files:</strong> ${post.mediaFiles.length} attached<br>` : ''}
                ${post.errorMessage ? `<strong>❌ Error:</strong> ${post.errorMessage}<br>` : ''}
              </div>
              
              ${post.errorMessage ? `
                <div class="error-message">
                  <strong>Error Details:</strong><br>
                  ${post.errorMessage}
                </div>
              ` : ''}
            </div>
            
            <div class="footer">
              <p>${status === 'published' 
                ? 'Your post has been successfully published to all specified platforms.' 
                : 'Please check your platform settings and try again.'
              }</p>
              <p>© 2024 Media Suite. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return { subject, html };
  }

  // Weekly digest template
  static getWeeklyDigestTemplate(data: EmailTemplateData, events: IEvent[], posts: IPost[]): { subject: string; html: string } {
    const { user } = data;

    const upcomingEvents = events.filter(event => 
      new Date(event.startDateTime) > new Date() && 
      new Date(event.startDateTime) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    const recentPosts = posts.filter(post => 
      new Date(post.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );

    const subject = 'Your Weekly Media Suite Digest';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Weekly Digest</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .section { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .section-title { color: #007bff; font-size: 20px; margin: 0 0 15px 0; }
          .item { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; border-left: 4px solid #007bff; }
          .item-title { font-weight: bold; margin-bottom: 5px; }
          .item-meta { color: #666; font-size: 14px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .empty-state { text-align: center; color: #666; font-style: italic; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Weekly Digest</h1>
            <p>Here's what's happening in your Media Suite</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h2 class="section-title">📅 Upcoming Events (Next 7 Days)</h2>
              ${upcomingEvents.length > 0 
                ? upcomingEvents.map(event => `
                  <div class="item">
                    <div class="item-title">${event.title}</div>
                    <div class="item-meta">
                      ${new Date(event.startDateTime).toLocaleDateString()} at ${new Date(event.startDateTime).toLocaleTimeString()} • ${event.eventType}
                    </div>
                  </div>
                `).join('')
                : '<div class="empty-state">No upcoming events this week</div>'
              }
            </div>
            
            <div class="section">
              <h2 class="section-title">📝 Recent Posts</h2>
              ${recentPosts.length > 0 
                ? recentPosts.map(post => `
                  <div class="item">
                    <div class="item-title">${post.title}</div>
                    <div class="item-meta">
                      Status: ${post.status} • Created: ${new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                `).join('')
                : '<div class="empty-state">No posts created this week</div>'
              }
            </div>
            
            <div class="footer">
              <p>Thank you for using Media Suite!</p>
              <p>© 2024 Media Suite. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return { subject, html };
  }

  // Password reset template
  static getPasswordResetTemplate(data: EmailTemplateData): { subject: string; html: string } {
    const { user, resetUrl } = data;
    if (!resetUrl) throw new Error('Reset URL is required for password reset template');

    const subject = 'Password Reset Request - Media Suite';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .reset-card { background: white; padding: 25px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .reset-title { color: #dc3545; font-size: 24px; margin: 0 0 15px 0; }
          .reset-button { display: inline-block; background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
          .reset-button:hover { background: #c82333; }
          .warning { background: #fff3cd; color: #856404; padding: 15px; border-radius: 5px; margin: 15px 0; border: 1px solid #ffeaa7; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .security-badge { background: #dc3545; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; display: inline-block; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset Request</h1>
            <p>You requested to reset your password</p>
          </div>
          
          <div class="content">
            <div class="security-badge">🔒 Secure Password Reset</div>
            
            <div class="reset-card">
              <h2 class="reset-title">Reset Your Password</h2>
              
              <p>Hello ${user.name},</p>
              
              <p>We received a request to reset your password for your Media Suite account. If you didn't make this request, you can safely ignore this email.</p>
              
              <p>To reset your password, click the button below:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="reset-button">Reset Password</a>
              </div>
              
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>This link will expire in 10 minutes</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>For security, this link can only be used once</li>
                </ul>
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
            </div>
            
            <div class="footer">
              <p>This is an automated message from Media Suite. Please do not reply to this email.</p>
              <p>© 2024 Media Suite. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return { subject, html };
  }
} 