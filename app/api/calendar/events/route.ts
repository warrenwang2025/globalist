import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import Event from '@/lib/models/Event';

// Force dynamic rendering for this route since it uses authentication
export const dynamic = 'force-dynamic';
import Post from '@/lib/models/Post';
import UserSettings from '@/lib/models/UserSettings';

// POST - Create a new event
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Received event data:', body);
    const { title, description, date, type, duration, attendees } = body;
    if (!title || !date || !type) {
      console.log('Missing required fields:', { title: !!title, date: !!date, type: !!type });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await dbConnect();
    const event = new Event({
      userId: session.user.id,
      title,
      description,
      startDateTime: new Date(date),
      eventType: type,
      duration: duration || 60,
      attendees,
    });
    await event.save();
    return NextResponse.json({ success: true, event });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

// PUT - Update an event
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { eventId, ...updateData } = body;

    if (!eventId) {
      return NextResponse.json({ 
        error: 'eventId is required' 
      }, { status: 400 });
    }

    // Find the event and ensure it belongs to the user
    const event = await Event.findOne({ 
      _id: eventId, 
      userId: session.user.id 
    });

    if (!event) {
      return NextResponse.json({ 
        error: 'Event not found or access denied' 
      }, { status: 404 });
    }

    // If updating sourcePostId, verify the post exists and belongs to the user
    if (updateData.sourcePostId) {
      const post = await Post.findOne({ 
        _id: updateData.sourcePostId, 
        userId: session.user.id 
      });
      
      if (!post) {
        return NextResponse.json({ 
          error: 'Post not found or access denied' 
        }, { status: 404 });
      }
    }

    // Update the event
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      updateData,
      { new: true, runValidators: true }
    ).populate('sourcePostId', 'title contentText status platforms mediaFiles');

    return NextResponse.json({ 
      success: true, 
      data: updatedEvent 
    });

  } catch (error: any) {
    console.error('Error updating event:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}

// DELETE - Delete an event
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({ 
        error: 'eventId is required' 
      }, { status: 400 });
    }

    // Find and delete the event, ensuring it belongs to the user
    const event = await Event.findOneAndDelete({ 
      _id: eventId, 
      userId: session.user.id 
    });

    if (!event) {
      return NextResponse.json({ 
        error: 'Event not found or access denied' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });

  } catch (error: any) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
} 