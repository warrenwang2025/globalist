"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Globe,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { SiTiktok } from 'react-icons/si';

interface PlatformConnection {
  id: number;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  isConnected: boolean;
  username?: string;
  lastSync?: string;
}

export function PlatformIntegrations() {
  const [platforms, setPlatforms] = useState<PlatformConnection[]>([
    {
      id: 1,
      name: "X (Twitter)",
      icon: Twitter,
      description: "Connect your X account",
      isConnected: false
    },
    {
      id: 2,
      name: "LinkedIn",
      icon: Linkedin,
      description: "Connect your LinkedIn profile",
      isConnected: true,
      username: "@yourprofile",
      lastSync: "2 hours ago"
    },
    {
      id: 3,
      name: "Instagram",
      icon: Instagram,
      description: "Connect your Instagram account",
      isConnected: false
    },
    {
      id: 4,
      name: "TikTok",
      icon: SiTiktok,
      description: "Connect your TikTok account",
      isConnected: false
    },
    {
      id: 5,
      name: "YouTube",
      icon: Youtube,
      description: "Connect your YouTube account",
      isConnected: false
    },
    {
      id: 6,
      name: "Personal Website",
      icon: Globe,
      description: "Connect your Personal WordPress Website",
      isConnected: false
    }
  ]);

  const handleConnect = (platformId: number) => {
    setPlatforms(prev =>
      prev.map(platform =>
        platform.id === platformId
          ? {
              ...platform,
              isConnected: true,
              username: "@connected",
              lastSync: "Just now"
            }
          : platform
      )
    );
  };

  const handleDisconnect = (platformId: number) => {
    setPlatforms(prev =>
      prev.map(platform =>
        platform.id === platformId
          ? {
              ...platform,
              isConnected: false,
              username: undefined,
              lastSync: undefined
            }
          : platform
      )
    );
  };

  return (
    <Card className="p-4 md:p-6 overflow-x-hidden">
      <h2 className="text-lg md:text-xl font-semibold mb-6">
        Connected Accounts
      </h2>

      <div className="space-y-4">
        {platforms.map(platform => {
          const IconComponent = platform.icon;

          return (
            <div
              key={platform.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Label className="text-base">{platform.name}</Label>
                    {platform.isConnected ? (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-gray-600">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Not Connected
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {platform.description}
                  </p>
                  {platform.isConnected && platform.username && (
                    <p className="text-xs text-blue-600">
                      {platform.username} • Last sync: {platform.lastSync}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2 sm:flex-nowrap">
                {platform.isConnected ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(platform.id)}
                    >
                      Disconnect
                    </Button>
                    <Button variant="outline" size="sm">
                      Refresh
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => handleConnect(platform.id)}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
