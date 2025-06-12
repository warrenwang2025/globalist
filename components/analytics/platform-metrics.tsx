"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Globe,
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  MessageCircle,
  Share2,
} from "lucide-react";
import { SiTiktok } from "react-icons/si";

interface PlatformMetricsProps {
  timeRange: string;
  selectedPlatform: string;
}

const platformData = [
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: Twitter,
    color: "bg-black",
    followers: 5420,
    growth: 12.5,
    engagement: 8.2,
    reach: 45000,
    posts: 18,
    avgLikes: 124,
    avgComments: 23,
    avgShares: 45,
    topPost: "Product launch announcement",
    bestTime: "2:00 PM - 4:00 PM",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "bg-blue-600",
    followers: 3200,
    growth: 8.7,
    engagement: 12.1,
    reach: 28000,
    posts: 12,
    avgLikes: 89,
    avgComments: 34,
    avgShares: 67,
    topPost: "Industry insights article",
    bestTime: "9:00 AM - 11:00 AM",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "bg-gradient-to-r from-purple-500 to-pink-500",
    followers: 4800,
    growth: 15.3,
    engagement: 9.8,
    reach: 38000,
    posts: 15,
    avgLikes: 156,
    avgComments: 28,
    avgShares: 12,
    topPost: "Behind the scenes video",
    bestTime: "6:00 PM - 8:00 PM",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    color: "bg-red-600",
    followers: 1200,
    growth: 22.1,
    engagement: 15.6,
    reach: 15000,
    posts: 4,
    avgLikes: 234,
    avgComments: 67,
    avgShares: 89,
    topPost: "Tutorial: Getting Started",
    bestTime: "7:00 PM - 9:00 PM",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: SiTiktok,
    color: "bg-black",
    followers: 800,
    growth: 45.2,
    engagement: 18.9,
    reach: 12000,
    posts: 6,
    avgLikes: 189,
    avgComments: 45,
    avgShares: 78,
    topPost: "Quick tips compilation",
    bestTime: "8:00 PM - 10:00 PM",
  },
];

const weeklyData = [
  { day: "Mon", twitter: 120, linkedin: 80, instagram: 150, youtube: 45, tiktok: 200 },
  { day: "Tue", twitter: 100, linkedin: 95, instagram: 140, youtube: 50, tiktok: 180 },
  { day: "Wed", twitter: 140, linkedin: 110, instagram: 160, youtube: 60, tiktok: 220 },
  { day: "Thu", twitter: 130, linkedin: 120, instagram: 155, youtube: 55, tiktok: 210 },
  { day: "Fri", twitter: 160, linkedin: 140, instagram: 180, youtube: 70, tiktok: 250 },
  { day: "Sat", twitter: 180, linkedin: 90, instagram: 200, youtube: 80, tiktok: 280 },
  { day: "Sun", twitter: 150, linkedin: 70, instagram: 190, youtube: 75, tiktok: 260 },
];

export function PlatformMetrics({ timeRange, selectedPlatform }: PlatformMetricsProps) {
  const filteredPlatforms = selectedPlatform === "all" 
    ? platformData 
    : platformData.filter(p => p.id === selectedPlatform);

  return (
    <div className="space-y-6">
      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlatforms.map((platform) => {
          const IconComponent = platform.icon;
          return (
            <Card key={platform.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-full ${platform.color} text-white`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                  </div>
                  <Badge variant={platform.growth > 0 ? "default" : "destructive"}>
                    {platform.growth > 0 ? (
                      <TrendingUp className="mr-1 h-3 w-3" />
                    ) : (
                      <TrendingDown className="mr-1 h-3 w-3" />
                    )}
                    {platform.growth}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Followers</p>
                    <p className="font-semibold">{platform.followers.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Reach</p>
                    <p className="font-semibold">{platform.reach.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Posts</p>
                    <p className="font-semibold">{platform.posts}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Engagement</p>
                    <p className="font-semibold">{platform.engagement}%</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      Avg Likes
                    </span>
                    <span className="font-medium">{platform.avgLikes}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      Avg Comments
                    </span>
                    <span className="font-medium">{platform.avgComments}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Share2 className="h-3 w-3" />
                      Avg Shares
                    </span>
                    <span className="font-medium">{platform.avgShares}</span>
                  </div>
                </div>

                <div className="pt-2 border-t space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Top Post</p>
                    <p className="text-sm font-medium">{platform.topPost}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Best Time to Post</p>
                    <p className="text-sm font-medium">{platform.bestTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weekly Engagement Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Engagement by Platform</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="twitter" stroke="#000000" strokeWidth={2} name="X (Twitter)" />
              <Line type="monotone" dataKey="linkedin" stroke="#0077B5" strokeWidth={2} name="LinkedIn" />
              <Line type="monotone" dataKey="instagram" stroke="#E4405F" strokeWidth={2} name="Instagram" />
              <Line type="monotone" dataKey="youtube" stroke="#FF0000" strokeWidth={2} name="YouTube" />
              <Line type="monotone" dataKey="tiktok" stroke="#000000" strokeWidth={2} strokeDasharray="5 5" name="TikTok" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Platform Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {platformData.map((platform) => (
              <div key={platform.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <platform.icon className="h-4 w-4" />
                    <span className="font-medium">{platform.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {platform.engagement}% engagement
                  </span>
                </div>
                <Progress value={platform.engagement} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}