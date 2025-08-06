export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/lib/models/User';
import { imageOptimizationService } from '@/lib/services/imageOptimizationService';
import { s3Service } from '@/lib/services/s3Service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Validate image
    const validation = await imageOptimizationService.validateImage(buffer);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Get user for ID
    const user = await User.findOne({ email: session.user.email }).select('_id profilePicture');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Optimize image
    const optimizedImage = await imageOptimizationService.optimizeProfilePicture(
      buffer,
      'webp'
    );

    // Upload to S3
    const uploadResult = await s3Service.uploadProfilePicture(
      optimizedImage.buffer,
      file.name,
      user._id.toString(),
      optimizedImage.format
    );

    // Delete old profile picture if it exists and is from S3
    if (user.profilePicture && s3Service.isS3Url(user.profilePicture)) {
      const oldKey = s3Service.extractKeyFromUrl(user.profilePicture);
      if (oldKey) {
        await s3Service.deleteProfilePicture(oldKey);
      }
    }

    // Update user profile picture
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { profilePicture: uploadResult.url },
      { new: true, select: '-password -passwordConfirm -twoFactorSecret -sessions' }
    );

    return NextResponse.json({
      success: true,
      data: {
        profilePicture: uploadResult.url,
        size: uploadResult.size,
        format: uploadResult.format,
        width: optimizedImage.width,
        height: optimizedImage.height,
      }
    });
  } catch (error) {
    console.error('Profile picture upload error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('AWS S3 configuration missing')) {
        return NextResponse.json(
          { error: 'File upload service not configured' },
          { status: 503 }
        );
      }
      if (error.message.includes('Image optimization failed')) {
        return NextResponse.json(
          { error: 'Failed to process image' },
          { status: 400 }
        );
      }
      if (error.message.includes('S3 upload failed')) {
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email }).select('_id profilePicture');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete from S3 if it's an S3 URL
    if (user.profilePicture && s3Service.isS3Url(user.profilePicture)) {
      const key = s3Service.extractKeyFromUrl(user.profilePicture);
      if (key) {
        await s3Service.deleteProfilePicture(key);
      }
    }

    // Reset to default profile picture
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { profilePicture: '/default-user-profile-picture.webp' },
      { new: true, select: '-password -passwordConfirm -twoFactorSecret -sessions' }
    );

    return NextResponse.json({
      success: true,
      data: {
        profilePicture: updatedUser.profilePicture,
      }
    });
  } catch (error) {
    console.error('Profile picture delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 