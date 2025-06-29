import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { IUser } from '@/lib/models/User'; // Import your user interface

/**
 * Creates a JWT, sets it in a secure cookie, and returns a JSON response.
 * @param user The user object from the database.
 * @param statusCode The HTTP status code for the response.
 * @param message A success message for the response body.
 * @returns A NextResponse object.
 */
export const sendTokenResponse = (
  user: IUser,
  statusCode: number,
  message: string
) => {

  if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
    throw new Error('JWT_SECRET or JWT_EXPIRES_IN is not defined');
  }
  // 1. Create the token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  });

  // 2. Set the token in an HTTP-Only cookie
  cookies().set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60, // Corresponds to 30 days
    path: '/',
  });

  // 3. Remove password from the user object before sending it back
  const userForResponse = user.toObject();
  delete userForResponse.password;
  delete userForResponse.sessions; // Also good to hide sensitive session data

  // 4. Return the final JSON response
  return NextResponse.json(
    {
      message,
      user: userForResponse,
    },
    { status: statusCode }
  );
};