import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Event from '@/lib/models/Event';
import Post from '@/lib/models/Post';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const userId = session.user.id;

    // Fetch events
    const events = await Event.find({ userId }).sort({ startDateTime: 1 });

    // Fetch scheduled posts (status: scheduled)
    const scheduledPosts = await Post.find({ userId, status: 'scheduled' });

    return NextResponse.json({ events, scheduledPosts });
  } catch (error) {
    console.error('Error loading calendar data:', error);
    return NextResponse.json({ error: 'Failed to load calendar data' }, { status: 500 });
  }
} 