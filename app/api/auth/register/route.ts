import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import { NextResponse } from 'next/server';
import { sendTokenResponse } from '@/utils/authUtils'; // Import our new helper!

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, name, username, password, passwordConfirm, phone} = await request.json();

    // Mongoose handles all validation and hashing automatically via middleware
    const newUser = await User.create({
      email,
      name,
      username,
      password,
      passwordConfirm,
      phone,
    });

    // Use our helper to create the token, set the cookie, and send the response
    return sendTokenResponse(
      newUser,
      201, // 201 Created
      'User registered successfully. You are now logged in.'
    );

  } catch (error: any) {
    // This error handling is still important for validation failures
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    if (error.code === 11000) {
      return NextResponse.json({ message: 'User with this email or username already exists.' }, { status: 409 });
    }
    
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}