import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import crypto from 'crypto';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    await dbConnect();

    const { token } = params;
    const { password } = await request.json();

    // Validate password
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Hash the token parameter using crypto SHA-256
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with matching hashed token and unexpired token
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Token is invalid or has expired' },
        { status: 400 }
      );
    }

    // Update user password and clear reset token fields
    user.password = password;
    user.passwordConfirm = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Save user (triggers password validation)
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 