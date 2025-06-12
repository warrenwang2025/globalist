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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AnalyticsOverviewProps {
  timeRange: string;
}

const engagementData = [
  { date: "Jan 1", reach: 4000, engagement: 240, clicks: 120 },
  { date: "Jan 8", reach: 3000, engagement: 139, clicks: 98 },
  { date: "Jan 15", reach: 2000, engagement: 980, clicks: 208 },
  { date: "Jan 22", reach: 2780, engagement: 390, clicks: 189 },
  { date: "Jan 29", reach: 1890, engagement: 480, clicks: 239 },
  { date: "Feb 5", reach: 2390, engagement: 380, clicks: 349 },
  { date: "Feb 12", reach: 3490, engagement: 430, clicks: 200 },
];

const platformData = [
  { name: "X (Twitter)", value: 35, color: "#000000" },
  { name: "LinkedIn", value: 25, color: "#0077B5" },
  { name: "Instagram", value: 20, color: "#E4405F" },
  { name: "YouTube", value: 15, color: "#FF0000" },
  { name: "TikTok", value: 5, color: "#000000" },
];

const contentTypeData = [
  { type: "Images", posts: 24, engagement: 8.5 },
  { type: "Videos", posts: 12, engagement: 12.3 },
  { type: "Text", posts: 18, engagement: 6.2 },
  { type: "Carousels", posts: 8, engagement: 9.8 },
];

export function AnalyticsOverview({ timeRange }: AnalyticsOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Performance Overview Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Performance Overview</CardTitle>
            <Badge variant="outline">{timeRange}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="reach"
                stroke="#8884d8"
                strokeWidth={2}
                name="Reach"
              />
              <Line
                type="monotone"
                dataKey="engagement"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Engagement"
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#ffc658"
                strokeWidth={2}
                name="Clicks"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {platformData.map((platform, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: platform.color }}
                    />
                    <span>{platform.name}</span>
                  </div>
                  <span className="font-medium">{platform.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Type Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Content Type Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={contentTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="engagement" fill="#8884d8" name="Engagement Rate %" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {contentTypeData.map((content, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{content.type}</span>
                  <div className="flex gap-4">
                    <span className="text-muted-foreground">{content.posts} posts</span>
                    <span className="font-medium">{content.engagement}% engagement</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}