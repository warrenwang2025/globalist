import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import emailService from '@/lib/services/emailService';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email } = await request.json();

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create password reset token
    const resetToken = user.createPasswordResetToken();

    // Save user with validateBeforeSave: false to bypass validation
    await user.save({ validateBeforeSave: false });

    // Construct reset URL
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = request.headers.get('host');
    const resetUrl = `${protocol}://${host}/reset-password/${resetToken}`;

    // Send password reset email
    const emailSent = await emailService.sendPasswordResetEmail(user, resetUrl);

    if (!emailSent) {
      // If email fails, clear the reset token
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return NextResponse.json(
        { error: 'Failed to send password reset email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset email sent successfully'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 