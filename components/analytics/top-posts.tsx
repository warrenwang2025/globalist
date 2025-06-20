"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MessageCircle,
  Share2,
  Eye,
  ExternalLink,
  TrendingUp,
  Image as ImageIcon,
  Video,
  FileText,
} from "lucide-react";

const topPosts = [
  {
    id: 1,
    title: "Product Launch Announcement",
    type: "Image",
    platform: "LinkedIn",
    publishDate: "2024-01-15",
    thumbnail:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
    metrics: {
      likes: 567,
      comments: 89,
      shares: 123,
      views: 12500,
      engagement: 15.8,
    },
    performance: "high",
  },
  {
    id: 2,
    title: "Behind the Scenes Video",
    type: "Video",
    platform: "Instagram",
    publishDate: "2024-01-14",
    thumbnail:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=100&h=100&fit=crop",
    metrics: {
      likes: 789,
      comments: 156,
      shares: 67,
      views: 18900,
      engagement: 18.2,
    },
    performance: "high",
  },
  {
    id: 3,
    title: "Industry Insights Thread",
    type: "Text",
    platform: "X (Twitter)",
    publishDate: "2024-01-13",
    thumbnail: null,
    metrics: {
      likes: 234,
      comments: 45,
      shares: 89,
      views: 6700,
      engagement: 12.1,
    },
    performance: "medium",
  },
  {
    id: 4,
    title: "Tutorial: Getting Started",
    type: "Video",
    platform: "YouTube",
    publishDate: "2024-01-12",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop",
    metrics: {
      likes: 445,
      comments: 78,
      shares: 156,
      views: 15600,
      engagement: 16.9,
    },
    performance: "high",
  },
  {
    id: 5,
    title: "Quick Tips Carousel",
    type: "Carousel",
    platform: "Instagram",
    publishDate: "2024-01-11",
    thumbnail:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=100&h=100&fit=crop",
    metrics: {
      likes: 298,
      comments: 34,
      shares: 45,
      views: 7800,
      engagement: 11.4,
    },
    performance: "medium",
  },
];

export function TopPosts() {
  const getContentIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <Video className="h-4 w-4 text-red-500" />;
      case "Image":
      case "Carousel":
        return <ImageIcon className="h-4 w-4 text-blue-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPerformanceBadge = (performance: string) => {
    switch (performance) {
      case "high":
        return (
          <Badge className="bg-green-100 text-green-800">
            High Performance
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            Good Performance
          </Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">Average</Badge>;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Performing Posts
          </CardTitle>
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPosts.map((post, index) => (
            <div
              key={post.id}
              className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>

              {/* Thumbnail */}
              <div className="flex-shrink-0">
                {post.thumbnail ? (
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    {getContentIcon(post.type)}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-sm truncate">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      {getContentIcon(post.type)}
                      <span className="text-xs text-muted-foreground">
                        {post.type} • {post.platform}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.publishDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {getPerformanceBadge(post.performance)}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3 text-gray-500" />
                    <span className="font-medium">
                      {formatNumber(post.metrics.views)}
                    </span>
                    <span className="text-muted-foreground">views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-red-500" />
                    <span className="font-medium">
                      {formatNumber(post.metrics.likes)}
                    </span>
                    <span className="text-muted-foreground">likes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3 text-blue-500" />
                    <span className="font-medium">{post.metrics.comments}</span>
                    <span className="text-muted-foreground">comments</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="h-3 w-3 text-green-500" />
                    <span className="font-medium">{post.metrics.shares}</span>
                    <span className="text-muted-foreground">shares</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-purple-500" />
                    <span className="font-medium">
                      {post.metrics.engagement}%
                    </span>
                    <span className="text-muted-foreground">engagement</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Engagement Rate Comparison */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Rate by Content Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      15.6%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Video Content
                    </p>
                    <Badge className="mt-1 bg-blue-100 text-blue-800">
                      Highest
                    </Badge>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      11.2%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Image Carousels
                    </p>
                    <Badge className="mt-1 bg-green-100 text-green-800">
                      Good
                    </Badge>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      8.9%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Single Images
                    </p>
                    <Badge className="mt-1 bg-orange-100 text-orange-800">
                      Average
                    </Badge>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    💡 Insights & Recommendations
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>
                      • Video content performs 75% better than static images
                    </li>
                    <li>
                      • Friday posts receive 23% more engagement than average
                    </li>
                    <li>• Posting between 6-8 PM maximizes audience reach</li>
                    <li>• Carousel posts have 40% higher save rates</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Summary
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">📊 Performance Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-blue-800">
                <strong>Best Performing Type:</strong> Video content
              </p>
              <p className="text-blue-700">Average 17.1% engagement rate</p>
            </div>
            <div>
              <p className="text-blue-800">
                <strong>Top Platform:</strong> Instagram
              </p>
              <p className="text-blue-700">Highest overall engagement</p>
            </div>
            <div>
              <p className="text-blue-800">
                <strong>Peak Performance:</strong> Behind the Scenes
              </p>
              <p className="text-blue-700">18.2% engagement rate</p>
            </div>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}
