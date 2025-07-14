export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    // Get the session to verify user authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // Connect to database
    await dbConnect();

    // Get the user ID from session
    const userId = session.user.id;

    // Update user's onboarding status
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isOnboarded: true,
        onboardedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    // Return success response with updated user data
    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully!',
      user: {
        id: updatedUser._id,
        isOnboarded: updatedUser.isOnboarded,
        onboardedAt: updatedUser.onboardedAt,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePicture: updatedUser.profilePicture,
        userSubscriptionLevel: updatedUser.userSubscriptionLevel,
      }
    });

  } catch (error) {
    console.error('Onboarding completion error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
