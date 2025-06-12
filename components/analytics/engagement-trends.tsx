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
} from "recharts";
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  TrendingUp,
  TrendingDown,
  Clock,
} from "lucide-react";

interface EngagementTrendsProps {
  timeRange: string;
}

const engagementData = [
  { date: "Jan 1", likes: 1200, comments: 180, shares: 95, views: 8500 },
  { date: "Jan 8", likes: 1100, comments: 165, shares: 87, views: 7800 },
  { date: "Jan 15", likes: 1350, comments: 210, shares: 120, views: 9200 },
  { date: "Jan 22", likes: 1280, comments: 195, shares: 105, views: 8900 },
  { date: "Jan 29", likes: 1450, comments: 225, shares: 135, views: 9800 },
  { date: "Feb 5", likes: 1380, comments: 205, shares: 115, views: 9100 },
  { date: "Feb 12", likes: 1520, comments: 240, shares: 145, views: 10200 },
];

const hourlyEngagement = [
  { hour: "00:00", engagement: 12 },
  { hour: "02:00", engagement: 8 },
  { hour: "04:00", engagement: 5 },
  { hour: "06:00", engagement: 15 },
  { hour: "08:00", engagement: 35 },
  { hour: "10:00", engagement: 55 },
  { hour: "12:00", engagement: 75 },
  { hour: "14:00", engagement: 85 },
  { hour: "16:00", engagement: 92 },
  { hour: "18:00", engagement: 98 },
  { hour: "20:00", engagement: 88 },
  { hour: "22:00", engagement: 65 },
];

const weeklyEngagement = [
  { day: "Monday", engagement: 78, posts: 3 },
  { day: "Tuesday", engagement: 82, posts: 4 },
  { day: "Wednesday", engagement: 85, posts: 5 },
  { day: "Thursday", engagement: 88, posts: 4 },
  { day: "Friday", engagement: 92, posts: 6 },
  { day: "Saturday", engagement: 75, posts: 2 },
  { day: "Sunday", engagement: 68, posts: 2 },
];

const engagementMetrics = [
  {
    metric: "Likes",
    current: 1520,
    previous: 1380,
    change: 10.1,
    icon: Heart,
    color: "text-red-500",
  },
  {
    metric: "Comments",
    current: 240,
    previous: 205,
    change: 17.1,
    icon: MessageCircle,
    color: "text-blue-500",
  },
  {
    metric: "Shares",
    current: 145,
    previous: 115,
    change: 26.1,
    icon: Share2,
    color: "text-green-500",
  },
  {
    metric: "Views",
    current: 10200,
    previous: 9100,
    change: 12.1,
    icon: Eye,
    color: "text-purple-500",
  },
];

export function EngagementTrends({ timeRange }: EngagementTrendsProps) {
  return (
    <div className="space-y-6">
      {/* Engagement Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {engagementMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          const isPositive = metric.change > 0;
          
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
                <IconComponent className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.current.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={isPositive ? "text-green-600" : "text-red-600"}>
                    {isPositive ? "+" : ""}{metric.change}%
                  </span>
                  <span>from last period</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Engagement Trends Over Time */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Engagement Trends Over Time</CardTitle>
            <Badge variant="outline">{timeRange}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="likes"
                stackId="1"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.6}
                name="Likes"
              />
              <Area
                type="monotone"
                dataKey="comments"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
                name="Comments"
              />
              <Area
                type="monotone"
                dataKey="shares"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Shares"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Engagement Pattern */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Hourly Engagement Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={hourlyEngagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Engagement %"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Peak engagement: 6:00 PM - 8:00 PM</p>
              <p>Lowest engagement: 4:00 AM - 6:00 AM</p>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Engagement Pattern */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Engagement Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyEngagement}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="engagement" fill="#82ca9d" name="Engagement %" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-1">
              {weeklyEngagement.map((day, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{day.day}</span>
                  <div className="flex gap-4">
                    <span className="text-muted-foreground">{day.posts} posts</span>
                    <span className="font-medium">{day.engagement}% engagement</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Rate Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Rate by Content Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">15.6%</div>
                <p className="text-sm text-muted-foreground">Video Content</p>
                <Badge className="mt-1 bg-blue-100 text-blue-800">Highest</Badge>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">11.2%</div>
                <p className="text-sm text-muted-foreground">Image Carousels</p>
                <Badge className="mt-1 bg-green-100 text-green-800">Good</Badge>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">8.9%</div>
                <p className="text-sm text-muted-foreground">Single Images</p>
                <Badge className="mt-1 bg-orange-100 text-orange-800">Average</Badge>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">💡 Insights & Recommendations</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Video content performs 75% better than static images</li>
                <li>• Friday posts receive 23% more engagement than average</li>
                <li>• Posting between 6-8 PM maximizes audience reach</li>
                <li>• Carousel posts have 40% higher save rates</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}