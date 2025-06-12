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
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  MapPin,
  Clock,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  TrendingUp,
} from "lucide-react";

interface AudienceInsightsProps {
  timeRange: string;
}

const demographicsData = [
  { age: "18-24", percentage: 25, count: 3855 },
  { age: "25-34", percentage: 35, count: 5397 },
  { age: "35-44", percentage: 22, count: 3392 },
  { age: "45-54", percentage: 12, count: 1850 },
  { age: "55+", percentage: 6, count: 926 },
];

const genderData = [
  { name: "Female", value: 52, color: "#ff6b9d" },
  { name: "Male", value: 45, color: "#4ecdc4" },
  { name: "Other", value: 3, color: "#95e1d3" },
];

const locationData = [
  { country: "United States", percentage: 35, count: 5397 },
  { country: "United Kingdom", percentage: 18, count: 2776 },
  { country: "Canada", percentage: 12, count: 1850 },
  { country: "Australia", percentage: 8, count: 1234 },
  { country: "Germany", percentage: 7, count: 1080 },
  { country: "France", percentage: 6, count: 926 },
  { country: "Others", percentage: 14, count: 2159 },
];

const deviceData = [
  { device: "Mobile", percentage: 68, color: "#8884d8" },
  { device: "Desktop", percentage: 25, color: "#82ca9d" },
  { device: "Tablet", percentage: 7, color: "#ffc658" },
];

const activityData = [
  { hour: "00", activity: 5 },
  { hour: "02", activity: 3 },
  { hour: "04", activity: 2 },
  { hour: "06", activity: 8 },
  { hour: "08", activity: 25 },
  { hour: "10", activity: 45 },
  { hour: "12", activity: 65 },
  { hour: "14", activity: 78 },
  { hour: "16", activity: 85 },
  { hour: "18", activity: 92 },
  { hour: "20", activity: 88 },
  { hour: "22", activity: 45 },
];

const growthData = [
  { month: "Jan", followers: 12000, engagement: 8.2 },
  { month: "Feb", followers: 12800, engagement: 8.5 },
  { month: "Mar", followers: 13500, engagement: 9.1 },
  { month: "Apr", followers: 14200, engagement: 8.8 },
  { month: "May", followers: 15000, engagement: 9.3 },
  { month: "Jun", followers: 15420, engagement: 8.9 },
];

export function AudienceInsights({ timeRange }: AudienceInsightsProps) {
  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "Mobile":
        return <Smartphone className="h-4 w-4" />;
      case "Desktop":
        return <Monitor className="h-4 w-4" />;
      case "Tablet":
        return <Tablet className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Audience Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Audience</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,420</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5.2%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Age</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32.5</div>
            <p className="text-xs text-muted-foreground">
              Most active: 25-34 years
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Location</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">US</div>
            <p className="text-xs text-muted-foreground">
              35% of total audience
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6 PM</div>
            <p className="text-xs text-muted-foreground">
              Highest engagement time
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Demographics */}
        <Card>
          <CardHeader>
            <CardTitle>Age Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={demographicsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="percentage" fill="#8884d8" name="Percentage" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {demographicsData.map((demo, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{demo.age} years</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{demo.count.toLocaleString()}</span>
                    <span className="font-medium">{demo.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Gender Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {genderData.map((gender, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: gender.color }}
                    />
                    <span>{gender.name}</span>
                  </div>
                  <span className="font-medium">{gender.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Geographic Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {locationData.map((location, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{location.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {location.count.toLocaleString()}
                    </span>
                    <span className="text-sm font-medium">{location.percentage}%</span>
                  </div>
                </div>
                <Progress value={location.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Device Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceData.map((device, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device.device)}
                      <span className="font-medium">{device.device}</span>
                    </div>
                    <span className="text-sm font-medium">{device.percentage}%</span>
                  </div>
                  <Progress value={device.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="activity"
                  stroke="#8884d8"
                  strokeWidth={2}
                  name="Activity %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Audience Growth */}
      <Card>
        <CardHeader>
          <CardTitle>Audience Growth Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="followers" fill="#8884d8" name="Followers" />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="engagement"
                stroke="#82ca9d"
                strokeWidth={2}
                name="Engagement %"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}