import { NextRequest, NextResponse } from 'next/server';
import notificationScheduler from '@/lib/services/notificationScheduler';

// This endpoint will be called by a cron job service (like Vercel Cron)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const secret = searchParams.get('secret');

    // Verify the request is from a legitimate cron service
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (action === null) {
      return NextResponse.json({
        error: "Missing 'action' parameter. Valid actions: process-notifications, create-event-notifications, create-post-notifications, cleanup"
      }, { status: 400 });
    }

    switch (action) {
      case 'process-notifications':
        await notificationScheduler.processPendingNotifications();
        break;
      case 'create-event-notifications':
        await notificationScheduler.createEventNotifications();
        break;
      case 'create-post-notifications':
        await notificationScheduler.createPostNotifications();
        break;
      case 'cleanup':
        await notificationScheduler.cleanupOldNotifications();
        break;
      default:
        return NextResponse.json({
          error: "Invalid action. Valid actions: process-notifications, create-event-notifications, create-post-notifications, cleanup"
        }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Action '${action}' completed successfully`,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}

// POST method for manual triggering (for testing)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, secret } = body;

    // Verify the request is from a legitimate source
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (action === null) {
      return NextResponse.json({
        error: "Missing 'action' parameter. Valid actions: process-notifications, create-event-notifications, create-post-notifications, cleanup"
      }, { status: 400 });
    }

    switch (action) {
      case 'process-notifications':
        await notificationScheduler.processPendingNotifications();
        break;
      case 'create-event-notifications':
        await notificationScheduler.createEventNotifications();
        break;
      case 'create-post-notifications':
        await notificationScheduler.createPostNotifications();
        break;
      case 'cleanup':
        await notificationScheduler.cleanupOldNotifications();
        break;
      default:
        return NextResponse.json({
          error: "Invalid action. Valid actions: process-notifications, create-event-notifications, create-post-notifications, cleanup"
        }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Action '${action}' completed successfully`,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Cron job error:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
} 