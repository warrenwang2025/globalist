"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Shield, Eye, Download, Trash2, Save } from "lucide-react";
import axios from "axios";

export function PrivacySettings() {
  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    dataCollection: false,
    analyticsSharing: true,
    marketingCommunications: false,
    thirdPartyIntegrations: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await axios.get('/api/settings');
      if (response.data.success && response.data.data.privacy) {
        setPrivacy(response.data.data.privacy);
      }
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrivacyChange = (key: keyof typeof privacy, value: boolean) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const response = await axios.patch('/api/settings', {
        category: 'privacy',
        data: privacy
      });
      
      if (response.data.success) {
        setLastSaved(new Date().toLocaleTimeString());
      }
    } catch (error: any) {
      console.error('Error saving privacy settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy & Data
        </h2>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
        <Shield className="h-5 w-5" />
        Privacy & Data
      </h2>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Profile Visibility</Label>
            <p className="text-sm text-muted-foreground">
              Make your profile visible to other users
            </p>
          </div>
          <Switch
            checked={privacy.profileVisibility}
            onCheckedChange={(checked) =>
              handlePrivacyChange("profileVisibility", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Data Collection</Label>
            <p className="text-sm text-muted-foreground">
              Allow collection of usage data for service improvement
            </p>
          </div>
          <Switch
            checked={privacy.dataCollection}
            onCheckedChange={(checked) =>
              handlePrivacyChange("dataCollection", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Analytics Sharing</Label>
            <p className="text-sm text-muted-foreground">
              Share anonymized analytics data with partners
            </p>
          </div>
          <Switch
            checked={privacy.analyticsSharing}
            onCheckedChange={(checked) =>
              handlePrivacyChange("analyticsSharing", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Marketing Communications</Label>
            <p className="text-sm text-muted-foreground">
              Receive personalized marketing communications
            </p>
          </div>
          <Switch
            checked={privacy.marketingCommunications}
            onCheckedChange={(checked) =>
              handlePrivacyChange("marketingCommunications", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Third-party Integrations</Label>
            <p className="text-sm text-muted-foreground">
              Allow third-party services to access your data
            </p>
          </div>
          <Switch
            checked={privacy.thirdPartyIntegrations}
            onCheckedChange={(checked) =>
              handlePrivacyChange("thirdPartyIntegrations", checked)
            }
          />
        </div>

        <div className="pt-6 border-t space-y-4">
          <h3 className="font-semibold">Data Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Eye className="h-6 w-6" />
              <div className="text-center">
                <p className="font-medium">View Data</p>
                <p className="text-xs text-muted-foreground">
                  See what data we have
                </p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Download className="h-6 w-6" />
              <div className="text-center">
                <p className="font-medium">Export Data</p>
                <p className="text-xs text-muted-foreground">
                  Download your data
                </p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-6 w-6" />
              <div className="text-center">
                <p className="font-medium">Delete Account</p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete
                </p>
              </div>
            </Button>
          </div>
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
  );
}
