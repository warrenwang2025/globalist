"use client"

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        <TabsContent value="notifications">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your activity
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive push notifications about your activity
                  </p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Connected Accounts</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>X (Twitter)</Label>
                  <p className="text-sm text-muted-foreground">
                    Connect your X account
                  </p>
                </div>
                <Button variant="outline">Connect</Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>LinkedIn</Label>
                  <p className="text-sm text-muted-foreground">
                    Connect your LinkedIn profile
                  </p>
                </div>
                <Button variant="outline">Connect</Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Instagram</Label>
                  <p className="text-sm text-muted-foreground">
                    Connect your Instagram account
                  </p>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tiktok</Label>
                  <p className="text-sm text-muted-foreground">
                    Connect your Tiktok account
                  </p>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Youtube</Label>
                  <p className="text-sm text-muted-foreground">
                    Connect your Youtube account
                  </p>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
                            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Personal Website</Label>
                  <p className="text-sm text-muted-foreground">
                    Connect your Personal Wordpress Website
                  </p>
                </div>
                <Button variant="outline">Connect</Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}