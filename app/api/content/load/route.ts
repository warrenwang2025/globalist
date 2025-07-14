import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import Post from '@/lib/models/Post';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find the post and ensure it belongs to the user
    const post = await Post.findOne({ 
      _id: postId, 
      userId: session.user.id 
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found or access denied' },
        { status: 404 }
      );
    }

    // Return only the fields needed for the content editor
    return NextResponse.json({
      id: post._id,
      title: post.title,
      blocks: post.blocks,
      status: post.status,
      platforms: post.platforms,
      tags: post.tags,
      isPublic: post.isPublic,
      scheduledDateTime: post.scheduledDateTime,
      publishedDate: post.publishedDate,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    });
  } catch (error) {
    console.error('Error loading content:', error);
    return NextResponse.json(
      { error: 'Failed to load content' },
      { status: 500 }
    );
  }
} 