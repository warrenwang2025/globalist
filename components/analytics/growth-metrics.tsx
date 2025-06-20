"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserPlus,
  UserMinus,
  Target,
  Calendar,
  Award,
} from "lucide-react";

interface GrowthMetricsProps {
  timeRange: string;
}

const followerGrowthData = [
  { month: "Jul", followers: 8500, gained: 450, lost: 120, net: 330 },
  { month: "Aug", followers: 9200, gained: 520, lost: 140, net: 380 },
  { month: "Sep", followers: 10100, gained: 680, lost: 180, net: 500 },
  { month: "Oct", followers: 11300, gained: 750, lost: 150, net: 600 },
  { month: "Nov", followers: 12800, gained: 820, lost: 170, net: 650 },
  { month: "Dec", followers: 14200, gained: 890, lost: 190, net: 700 },
  { month: "Jan", followers: 15420, gained: 920, lost: 200, net: 720 },
];

const platformGrowthData = [
  { platform: "Instagram", growth: 15.3, followers: 4800, color: "#E4405F" },
  { platform: "LinkedIn", growth: 8.7, followers: 3200, color: "#0077B5" },
  { platform: "X (Twitter)", growth: 12.5, followers: 5420, color: "#000000" },
  { platform: "YouTube", growth: 22.1, followers: 1200, color: "#FF0000" },
  { platform: "TikTok", growth: 45.2, followers: 800, color: "#000000" },
];

const engagementGrowthData = [
  { month: "Jul", engagement: 6.8, reach: 45000, impressions: 78000 },
  { month: "Aug", engagement: 7.2, reach: 52000, impressions: 89000 },
  { month: "Sep", engagement: 7.8, reach: 58000, impressions: 95000 },
  { month: "Oct", engagement: 8.1, reach: 62000, impressions: 102000 },
  { month: "Nov", engagement: 8.5, reach: 68000, impressions: 115000 },
  { month: "Dec", engagement: 8.9, reach: 75000, impressions: 125000 },
  { month: "Jan", engagement: 9.3, reach: 82000, impressions: 135000 },
];

const milestones = [
  {
    date: "2024-01-15",
    milestone: "15K Followers",
    description: "Reached 15,000 total followers across all platforms",
    type: "followers",
    icon: Users,
  },
  {
    date: "2024-01-10",
    milestone: "Viral Post",
    description: "Behind the scenes video reached 50K views",
    type: "content",
    icon: TrendingUp,
  },
  {
    date: "2024-01-05",
    milestone: "10% Engagement",
    description: "Average engagement rate exceeded 10% for the first time",
    type: "engagement",
    icon: Target,
  },
  {
    date: "2023-12-20",
    milestone: "YouTube Milestone",
    description: "Reached 1,000 subscribers on YouTube",
    type: "platform",
    icon: Award,
  },
];

const growthMetrics = [
  {
    metric: "Follower Growth Rate",
    current: "4.8%",
    target: "5.0%",
    progress: 96,
    trend: "up",
    change: "+0.3%",
  },
  {
    metric: "Engagement Growth",
    current: "9.3%",
    target: "10.0%",
    progress: 93,
    trend: "up",
    change: "+0.4%",
  },
  {
    metric: "Reach Growth",
    current: "12.1%",
    target: "15.0%",
    progress: 81,
    trend: "up",
    change: "+2.1%",
  },
  {
    metric: "Content Frequency",
    current: "5.2",
    target: "6.0",
    progress: 87,
    trend: "up",
    change: "+0.8",
  },
];

export function GrowthMetrics({ timeRange }: GrowthMetricsProps) {
  return (
    <div className="space-y-6">
      {/* Growth KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {growthMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{metric.current}</span>
                  <div className="flex items-center gap-1 text-xs">
                    {metric.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    )}
                    <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Target: {metric.target}</span>
                    <span>{metric.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${metric.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Follower Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Follower Growth Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={followerGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="followers"
                fill="#8884d8"
                fillOpacity={0.3}
                stroke="#8884d8"
                strokeWidth={2}
                name="Total Followers"
              />
              <Bar yAxisId="right" dataKey="gained" fill="#82ca9d" name="Gained" />
              <Bar yAxisId="right" dataKey="lost" fill="#ff7c7c" name="Lost" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="net"
                stroke="#ffc658"
                strokeWidth={3}
                name="Net Growth"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Growth Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Growth Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {platformGrowthData.map((platform, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{platform.platform}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {platform.followers.toLocaleString()} followers
                      </span>
                      <Badge
                        variant={platform.growth > 15 ? "default" : "secondary"}
                        className="text-xs"
                      >
                        +{platform.growth}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${Math.min(platform.growth * 2, 100)}%`,
                        backgroundColor: platform.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement & Reach Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={engagementGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="engagement"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Engagement %"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="reach"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Reach"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Milestones & Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recent Milestones & Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {milestones.map((milestone, index) => {
              const IconComponent = milestone.icon;
              return (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{milestone.milestone}</h4>
                      <span className="text-xs text-muted-foreground">
                        {new Date(milestone.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {milestone.type}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Growth Projections */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Projections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-2">18,500</div>
              <p className="text-sm text-muted-foreground mb-1">Projected Followers</p>
              <p className="text-xs text-muted-foreground">by March 2024</p>
              <Badge className="mt-2 bg-blue-100 text-blue-800">+20% growth</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-2">11.5%</div>
              <p className="text-sm text-muted-foreground mb-1">Projected Engagement</p>
              <p className="text-xs text-muted-foreground">by March 2024</p>
              <Badge className="mt-2 bg-green-100 text-green-800">+24% improvement</Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-2">125K</div>
              <p className="text-sm text-muted-foreground mb-1">Projected Monthly Reach</p>
              <p className="text-xs text-muted-foreground">by March 2024</p>
              <Badge className="mt-2 bg-purple-100 text-purple-800">+52% increase</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}