export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OnboardingPreferences from '@/lib/models/OnboardingPreferences';
import UserSettings from '@/lib/models/UserSettings';
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


    // Validate required fields
    if (!body.userType || !body.experience) {
      return NextResponse.json({ 
        error: 'userType and experience are required' 
      }, { status: 400 });
    }

    // Save core onboarding data
    const onboardingData = {
      userId,
      userType: body.userType,
      interests: body.interests || [],
      goals: body.goals || [],
      experience: body.experience
    };

    const onboardingPreferences = await OnboardingPreferences.findOneAndUpdate(
      { userId },
      onboardingData,
      { new: true, upsert: true, runValidators: true }
    );

    // Create or update UserSettings for preferences, integrations, etc.
    if (body.preferences || body.integrations) {
      const userSettingsData: any = { userId };

      // Handle preferences (notifications, ui, localization)
      if (body.preferences) {
        const prefs = body.preferences;
        
        // Notifications preferences
        userSettingsData.notifications = {
          emailNotifications: prefs.notifications !== undefined ? prefs.notifications : true,
          pushNotifications: prefs.emailUpdates !== undefined ? prefs.emailUpdates : true,
          marketingEmails: prefs.marketingEmails !== undefined ? prefs.marketingEmails : false,
          weeklyDigest: prefs.weeklyReports !== undefined ? prefs.weeklyReports : true
        };

        // General settings (from localization and ui)
        userSettingsData.general = {
          language: prefs.language || "en",
          timezone: prefs.timezone || "UTC",
          weekStart: prefs.weekStart || "monday",
          theme: prefs.darkMode ? "dark" : "light",
          dateFormat: "MM/DD/YYYY",
          timeFormat: "12h"
        };
      }

      // Handle platform integrations
      if (body.integrations && Array.isArray(body.integrations)) {
        userSettingsData.platformIntegrations = body.integrations.map((platformId: string) => ({
          platformId,
          isConnected: false, // Will be connected later
          syncEnabled: true
        }));
      }

      await UserSettings.findOneAndUpdate(
        { userId },
        userSettingsData,
        { new: true, upsert: true, runValidators: true }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: onboardingPreferences 
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
    const onboardingPreferences = await OnboardingPreferences.findOne({ userId });

    if (!onboardingPreferences) {
      return NextResponse.json({ 
        error: 'No preferences found' 
      }, { status: 404 });
    }

    // Get related UserSettings to reconstruct the old format if needed
    const userSettings = await UserSettings.findOne({ userId });

    // Transform back to frontend expected format
    const response = {
      userType: onboardingPreferences.userType,
      interests: onboardingPreferences.interests,
      goals: onboardingPreferences.goals,
      experience: onboardingPreferences.experience,
      preferences: userSettings ? {
        notifications: userSettings.notifications?.emailNotifications,
        emailUpdates: userSettings.notifications?.pushNotifications,
        darkMode: userSettings.general?.theme === 'dark',
        timezone: userSettings.general?.timezone,
        language: userSettings.general?.language,
        weekStart: userSettings.general?.weekStart,
      } : {},
      integrations: userSettings?.platformIntegrations?.map((p: any) => p.platformId) || []
    };

    return NextResponse.json({ 
      success: true, 
      data: response 
    });

  } catch (error: any) {
    console.error('Error fetching preferences:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 });
  }
}
