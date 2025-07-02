import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OnboardingPreferences from '@/lib/models/OnboardingPreferences';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const userId = session.user.id;

    console.log('Raw request body:', JSON.stringify(body, null, 2));

    // Validate required fields
    if (!body.userType || !body.experience) {
      return NextResponse.json({ 
        error: 'userType and experience are required' 
      }, { status: 400 });
    }

    // Transform the frontend data structure to match backend schema
    const transformedData: any = {
      userId,
      userType: body.userType,
      interests: body.interests || [],
      goals: body.goals || [],
      experience: body.experience,
      integrationsEnabled: body.integrations || []
    };

    // Transform preferences into nested structure
    if (body.preferences) {
      const prefs = body.preferences;
      
      // Notifications preferences
      transformedData.notifications = {
        notifications: prefs.notifications !== undefined ? prefs.notifications : true,
        emailUpdates: prefs.emailUpdates !== undefined ? prefs.emailUpdates : true,
        marketingEmails: prefs.marketingEmails !== undefined ? prefs.marketingEmails : false,
        weeklyReports: prefs.weeklyReports !== undefined ? prefs.weeklyReports : true
      };

      // Localization preferences  
      transformedData.localization = {
        language: prefs.language || "en",
        timezone: prefs.timezone || "UTC",
        weekStart: prefs.weekStart || "monday"
      };

      // UI preferences
      transformedData.ui = {
        darkMode: prefs.darkMode !== undefined ? prefs.darkMode : false
      };
    } else {
      // Set defaults if no preferences provided
      transformedData.notifications = {
        notifications: true,
        emailUpdates: true,
        marketingEmails: false,
        weeklyReports: true
      };
      transformedData.localization = {
        language: "en",
        timezone: "UTC", 
        weekStart: "monday"
      };
      transformedData.ui = {
        darkMode: false
      };
    }

    console.log('Transformed data:', JSON.stringify(transformedData, null, 2));

    // Save or update preferences
    const preferences = await OnboardingPreferences.findOneAndUpdate(
      { userId },
      transformedData,
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ 
      success: true, 
      data: preferences 
    });

  } catch (error: any) {
    console.error('Error saving preferences:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const preferences = await OnboardingPreferences.findOne({ userId });

    if (!preferences) {
      return NextResponse.json({ 
        error: 'No preferences found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: preferences 
    });

  } catch (error: any) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
