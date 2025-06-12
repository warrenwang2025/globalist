"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts";
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  TrendingUp,
  TrendingDown,
  Image as ImageIcon,
  Video,
  FileText,
  ExternalLink,
} from "lucide-react";

interface ContentPerformanceProps {
  timeRange: string;
}

const contentData = [
  {
    id: 1,
    title: "Product Launch Announcement",
    type: "Image",
    platform: "LinkedIn",
    publishDate: "2024-01-15",
    reach: 12500,
    likes: 234,
    comments: 45,
    shares: 67,
    engagement: 12.8,
    clicks: 89,
    status: "published",
  },
  {
    id: 2,
    title: "Behind the Scenes Video",
    type: "Video",
    platform: "Instagram",
    publishDate: "2024-01-14",
    reach: 8900,
    likes: 456,
    comments: 78,
    shares: 23,
    engagement: 15.2,
    clicks: 156,
    status: "published",
  },
  {
    id: 3,
    title: "Industry Insights Thread",
    type: "Text",
    platform: "X (Twitter)",
    publishDate: "2024-01-13",
    reach: 6700,
    likes: 189,
    comments: 34,
    shares: 89,
    engagement: 9.8,
    clicks: 67,
    status: "published",
  },
  {
    id: 4,
    title: "Tutorial: Getting Started",
    type: "Video",
    platform: "YouTube",
    publishDate: "2024-01-12",
    reach: 15600,
    likes: 567,
    comments: 123,
    shares: 234,
    engagement: 18.9,
    clicks: 345,
    status: "published",
  },
  {
    id: 5,
    title: "Quick Tips Carousel",
    type: "Carousel",
    platform: "Instagram",
    publishDate: "2024-01-11",
    reach: 7800,
    likes: 298,
    comments: 56,
    shares: 34,
    engagement: 11.4,
    clicks: 78,
    status: "published",
  },
];

const contentTypeData = [
  { type: "Video", posts: 12, avgEngagement: 15.6, totalReach: 89000 },
  { type: "Image", posts: 24, avgEngagement: 8.9, totalReach: 156000 },
  { type: "Carousel", posts: 8, avgEngagement: 11.2, totalReach: 67000 },
  { type: "Text", posts: 18, avgEngagement: 7.3, totalReach: 98000 },
];

const engagementVsReachData = contentData.map(item => ({
  reach: item.reach,
  engagement: item.engagement,
  title: item.title,
  type: item.type,
}));

export function ContentPerformance({ timeRange }: ContentPerformanceProps) {
  const getContentIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <Video className="h-4 w-4" />;
      case "Image":
        return <ImageIcon className="h-4 w-4" />;
      case "Carousel":
        return <ImageIcon className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getEngagementBadge = (engagement: number) => {
    if (engagement >= 15) return <Badge className="bg-green-100 text-green-800">High</Badge>;
    if (engagement >= 10) return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
    return <Badge className="bg-red-100 text-red-800">Low</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Content Type Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Content Type Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contentTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgEngagement" fill="#8884d8" name="Avg Engagement %" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
            {contentTypeData.map((content, index) => (
              <div key={index} className="text-center p-3 border rounded-lg">
                <div className="flex justify-center mb-2">
                  {getContentIcon(content.type)}
                </div>
                <p className="font-medium">{content.type}</p>
                <p className="text-sm text-muted-foreground">{content.posts} posts</p>
                <p className="text-sm font-semibold">{content.avgEngagement}% avg engagement</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Engagement vs Reach Scatter Plot */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement vs Reach Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={engagementVsReachData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="reach" name="Reach" />
              <YAxis dataKey="engagement" name="Engagement %" />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded-lg shadow-lg">
                        <p className="font-medium">{data.title}</p>
                        <p className="text-sm">Reach: {data.reach.toLocaleString()}</p>
                        <p className="text-sm">Engagement: {data.engagement}%</p>
                        <p className="text-sm">Type: {data.type}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter dataKey="engagement" fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Performing Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Top Performing Content</CardTitle>
            <Button variant="outline" size="sm">
              <ExternalLink className="mr-2 h-4 w-4" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Content</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Reach</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contentData.map((content) => (
                <TableRow key={content.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{content.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(content.publishDate).toLocaleDateString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getContentIcon(content.type)}
                      <span>{content.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{content.platform}</TableCell>
                  <TableCell>{content.reach.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {content.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {content.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="h-3 w-3" />
                          {content.shares}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Eye className="h-3 w-3" />
                        {content.clicks} clicks
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {content.engagement >= 12 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">{content.engagement}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getEngagementBadge(content.engagement)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}