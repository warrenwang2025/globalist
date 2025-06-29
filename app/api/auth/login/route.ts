import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';
import { sendTokenResponse } from '@/utils/authUtils'; // Import the helper here too!

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Please provide email and password.' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
        // If user not found or password doesn't match, return 401 Unauthorized
        console.error('Login failed: Incorrect email or password');
      return NextResponse.json(
        { message: 'Incorrect email or password.' },
        { status: 401 }
      );
    }

    // Use the helper here as well!
    return sendTokenResponse(
        user,
        200, // 200 OK
        'Logged in successfully.'
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}