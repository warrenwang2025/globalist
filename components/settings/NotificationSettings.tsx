"use client"

import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useState } from 'react'

interface NotificationSettingsProps {
  initialSettings?: {
    emailNotifications: boolean
    pushNotifications: boolean
    marketingEmails: boolean
    weeklyDigest: boolean
  }
}

export function NotificationSettings({ initialSettings }: NotificationSettingsProps) {
  const [settings, setSettings] = useState({
    emailNotifications: initialSettings?.emailNotifications ?? true,
    pushNotifications: initialSettings?.pushNotifications ?? true,
    marketingEmails: initialSettings?.marketingEmails ?? false,
    weeklyDigest: initialSettings?.weeklyDigest ?? true,
  })

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    // Here you would typically save to your backend
    console.log(`Updated ${key} to ${value}`)
  }

  return (
    <Card className="p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-6">Notification Preferences</h2>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive email updates about your activity and posts
            </p>
          </div>
          <Switch 
            checked={settings.emailNotifications}
            onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Push Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive push notifications about your activity
            </p>
          </div>
          <Switch 
            checked={settings.pushNotifications}
            onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Marketing Emails</Label>
            <p className="text-sm text-muted-foreground">
              Receive promotional emails and product updates
            </p>
          </div>
          <Switch 
            checked={settings.marketingEmails}
            onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Weekly Digest</Label>
            <p className="text-sm text-muted-foreground">
              Get a weekly summary of your social media performance
            </p>
          </div>
          <Switch 
            checked={settings.weeklyDigest}
            onCheckedChange={(checked) => handleSettingChange('weeklyDigest', checked)}
          />
        </div>
      </div>
    </Card>
  )
}