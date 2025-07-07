"use client"

import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Save, Check } from 'lucide-react'
import axios from 'axios'

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
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load settings on component mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await axios.get('/api/settings')
      if (response.data.success && response.data.data.notifications) {
        setSettings(response.data.data.notifications)
      }
    } catch (error) {
      console.error('Error loading notification settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      const response = await axios.patch('/api/settings', {
        category: 'notifications',
        data: settings
      })
      
      if (response.data.success) {
        setLastSaved(new Date().toLocaleTimeString())
      }
    } catch (error: any) {
      console.error('Error saving notification settings:', error)
      alert('Error saving settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-6">Notification Preferences</h2>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    )
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

        <div className="flex items-center justify-between pt-6 border-t">
          <div className="text-sm text-muted-foreground">
            {lastSaved && `Last saved: ${lastSaved}`}
          </div>
          <Button onClick={saveSettings} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  )
}