"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Globe,
  ArrowLeft,
  Calendar,
  Image as ImageIcon,
  Video,
  FileVideo,
  Clock,
  Users,
  Hash,
  AtSign,
} from "lucide-react";
import { SiTiktok } from "react-icons/si";

interface SerializableFile {
  name: string;
  type: string;
  size: number;
}

interface PreviewData {
  title: string;
  content: string;
  selectedPlatforms: number[];
  uploadedFiles: SerializableFile[];
  scheduleDate: string;
  scheduleTime: string;
}

const platforms = [
  {
    id: 1,
    name: "X",
    icon: Twitter,
    color: "bg-black text-white",
    limit: 280,
    features: {
      hashtags: true,
      mentions: true,
      threads: true,
      polls: true,
      mediaLimit: 4,
    },
  },
  {
    id: 2,
    name: "LinkedIn",
    icon: Linkedin,
    color: "bg-blue-600 text-white",
    limit: 3000,
    features: {
      hashtags: true,
      mentions: true,
      articles: true,
      polls: true,
      mediaLimit: 9,
    },
  },
  {
    id: 3,
    name: "Instagram",
    icon: Instagram,
    color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    limit: 2200,
    features: {
      hashtags: true,
      mentions: true,
      stories: true,
      reels: true,
      mediaLimit: 10,
    },
  },
  {
    id: 4,
    name: "YouTube",
    icon: Youtube,
    color: "bg-red-600 text-white",
    limit: 5000,
    features: {
      hashtags: true,
      chapters: true,
      thumbnails: true,
      shorts: true,
      mediaLimit: 1,
    },
  },
  {
    id: 5,
    name: "TikTok",
    icon: SiTiktok,
    color: "bg-blue-300 text-white",
    limit: 2200,
    features: {
      hashtags: true,
      mentions: true,
      effects: true,
      sounds: true,
      mediaLimit: 1,
    },
  },
  {
    id: 6,
    name: "Personal",
    icon: Globe,
    color: "bg-gray-600 text-white",
    limit: null,
    features: {
      hashtags: false,
      mentions: false,
      unlimited: true,
      customization: true,
      mediaLimit: null,
    },
  },
];

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [selectedPlatformView, setSelectedPlatformView] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const data = searchParams?.get("data");

      if (data) {
        const parsedData = JSON.parse(decodeURIComponent(data));
        console.log("Parsed preview data:", parsedData);

        setPreviewData(parsedData);

        if (
          parsedData.selectedPlatforms &&
          parsedData.selectedPlatforms.length > 0
        ) {
          setSelectedPlatformView(parsedData.selectedPlatforms[0]);
        }
      } else {
        setError("No preview data found in URL");
      }
    } catch (error) {
      console.error("Error parsing preview data:", error);
      setError("Failed to load preview data");
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  // Enhanced content processing functions
  const extractHashtags = (content: string) => {
    const hashtags = content.match(/#[\w]+/g) || [];
    return hashtags;
  };

  const extractMentions = (content: string) => {
    const mentions = content.match(/@[\w]+/g) || [];
    return mentions;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const closePreview = () => {
    if (window.opener) {
      window.close();
    } else {
      window.history.back();
    }
  };

  // Enhanced platform-specific preview rendering
  const renderPlatformPreview = (platform: (typeof platforms)[0]) => {
    const IconComponent = platform.icon;
    const textContent = previewData!.content.replace(/<[^>]*>/g, "");
    const isOverLimit = platform.limit && textContent.length > platform.limit;
    const remainingChars = platform.limit
      ? platform.limit - textContent.length
      : null;
    const hashtags = extractHashtags(textContent);
    const mentions = extractMentions(textContent);
    const mediaFiles = previewData!.uploadedFiles || [];
    const isMediaOverLimit =
      platform.features.mediaLimit &&
      mediaFiles.length > platform.features.mediaLimit;

    return (
      <Card key={platform.id} className="w-full max-w-md mx-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${platform.color}`}>
                <IconComponent className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{platform.name}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {platform.name} Preview
                </p>
              </div>
            </div>
            {platform.limit && (
              <Badge
                variant={
                  isOverLimit
                    ? "destructive"
                    : remainingChars && remainingChars < platform.limit * 0.1
                    ? "secondary"
                    : "outline"
                }
              >
                {remainingChars !== null
                  ? `${remainingChars} left`
                  : "No limit"}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Platform-specific mockup container */}
          <div className="border rounded-lg p-4 bg-gray-50 min-h-[200px]">
            {/* Post header mockup */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <IconComponent className="h-4 w-4 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-sm">Your Account</p>
                <p className="text-xs text-gray-500">
                  {previewData!.scheduleDate && previewData!.scheduleTime
                    ? new Date(
                        `${previewData!.scheduleDate}T${
                          previewData!.scheduleTime
                        }`
                      ).toLocaleDateString()
                    : "Now"}
                </p>
              </div>
            </div>

            {/* Title */}
            {previewData!.title && (
              <div className="mb-3">
                <h3 className="font-bold text-lg leading-tight">
                  {previewData!.title}
                </h3>
              </div>
            )}

            {/* Content */}
            <div className="mb-4">
              <div
                className={`prose prose-sm max-w-none leading-relaxed ${
                  isOverLimit ? "text-red-600" : "text-gray-800"
                }`}
                dangerouslySetInnerHTML={{ __html: previewData!.content }}
              />
            </div>

            {/* Media preview */}
            {mediaFiles.length > 0 && (
              <div className="mb-4">
                <div
                  className={`grid gap-2 ${
                    mediaFiles.length === 1
                      ? "grid-cols-1"
                      : mediaFiles.length === 2
                      ? "grid-cols-2"
                      : mediaFiles.length === 3
                      ? "grid-cols-3"
                      : "grid-cols-2"
                  }`}
                >
                  {mediaFiles
                    .slice(0, platform.features.mediaLimit || mediaFiles.length)
                    .map((file, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden"
                      >
                        {file.type.startsWith("image/") ? (
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        ) : (
                          <Video className="h-8 w-8 text-gray-400" />
                        )}
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                          {file.type.startsWith("image/") ? "IMG" : "VID"}
                        </div>
                      </div>
                    ))}
                  {platform.features.mediaLimit &&
                    mediaFiles.length > platform.features.mediaLimit && (
                      <div className="aspect-square bg-gray-300 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          +{mediaFiles.length - platform.features.mediaLimit}
                        </span>
                      </div>
                    )}
                </div>
                {isMediaOverLimit && (
                  <p className="text-xs text-red-500 mt-1">
                    Media limit exceeded for {platform.name} (
                    {platform.features.mediaLimit} max)
                  </p>
                )}
              </div>
            )}

            {/* Platform-specific engagement mockup */}
            <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-100"></div>
                {Math.floor(Math.random() * 100)} likes
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-100"></div>
                {Math.floor(Math.random() * 20)} comments
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-100"></div>
                {Math.floor(Math.random() * 10)} shares
              </span>
            </div>
          </div>

          <Separator />

          {/* Platform features and analytics */}
          <div className="space-y-3">
            {/* Hashtags and Mentions */}
            {(hashtags.length > 0 || mentions.length > 0) && (
              <div className="space-y-2">
                {hashtags.length > 0 && platform.features.hashtags && (
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      Hashtags ({hashtags.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {hashtags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {mentions.length > 0 && platform.features.mentions && (
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                      <AtSign className="h-3 w-3" />
                      Mentions ({mentions.length})
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {mentions.map((mention, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {mention}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Media files details */}
            {mediaFiles.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                  <ImageIcon className="h-3 w-3" />
                  Media Files ({mediaFiles.length})
                </h4>
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {mediaFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white rounded p-2 text-xs border"
                    >
                      {file.type.startsWith("image/") ? (
                        <ImageIcon className="h-3 w-3 text-blue-500 flex-shrink-0" />
                      ) : (
                        <FileVideo className="h-3 w-3 text-green-500 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{file.name}</p>
                        <p className="text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Schedule info */}
            {previewData!.scheduleDate && previewData!.scheduleTime && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Scheduled Publication
                </h4>
                <div className="flex items-center gap-1 text-sm bg-blue-50 p-2 rounded">
                  <Calendar className="h-3 w-3 text-blue-600" />
                  <span className="text-blue-800 font-medium">
                    {new Date(
                      `${previewData!.scheduleDate}T${
                        previewData!.scheduleTime
                      }`
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Platform-specific metrics */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Characters
                </p>
                <p
                  className={`text-sm font-semibold ${
                    isOverLimit ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {textContent.length}
                  {platform.limit && ` / ${platform.limit}`}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Media
                </p>
                <p
                  className={`text-sm font-semibold ${
                    isMediaOverLimit ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {mediaFiles.length}
                  {platform.features.mediaLimit &&
                    ` / ${platform.features.mediaLimit}`}
                </p>
              </div>
            </div>

            {/* Platform-specific warnings */}
            {(isOverLimit || isMediaOverLimit) && (
              <div className="bg-red-50 border border-red-200 rounded p-2">
                <p className="text-xs text-red-700 font-medium mb-1">
                  ⚠️ Platform Limitations
                </p>
                <ul className="text-xs text-red-600 space-y-1">
                  {isOverLimit && (
                    <li>
                      • Content exceeds {platform.name}&#39;s character limit
                    </li>
                  )}
                  {isMediaOverLimit && (
                    <li>
                      • Too many media files for {platform.name} (max:{" "}
                      {platform.features.mediaLimit})
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Platform-specific tips */}
            <div className="bg-blue-50 border border-blue-200 rounded p-2">
              <p className="text-xs text-blue-700 font-medium mb-1">
                💡 {platform.name} Tips
              </p>
              <ul className="text-xs text-blue-600 space-y-1">
                {platform.name === "X" && (
                  <>
                    <li>• Use threads for longer content</li>
                    <li>• Optimal posting times: 9AM-10AM, 12PM-1PM</li>
                  </>
                )}
                {platform.name === "LinkedIn" && (
                  <>
                    <li>• Professional tone works best</li>
                    <li>• Add industry-relevant hashtags</li>
                  </>
                )}
                {platform.name === "Instagram" && (
                  <>
                    <li>• Use 5-10 relevant hashtags</li>
                    <li>• High-quality visuals are essential</li>
                  </>
                )}
                {platform.name === "YouTube" && (
                  <>
                    <li>• Create compelling thumbnails</li>
                    <li>• Add timestamps for longer videos</li>
                  </>
                )}
                {platform.name === "TikTok" && (
                  <>
                    <li>• Trending hashtags boost visibility</li>
                    <li>• Keep videos under 60 seconds for better reach</li>
                  </>
                )}
                {platform.name === "Personal" && (
                  <>
                    <li>• No platform restrictions apply</li>
                    <li>• Customize as needed for your audience</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error || !previewData) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Preview Error</h1>
          <p className="text-muted-foreground mb-4">
            {error || "Unable to load preview data."}
          </p>
          <Button onClick={closePreview}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const textContent = previewData.content.replace(/<[^>]*>/g, "");

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Post Preview</h1>
            <p className="text-muted-foreground">
              See exactly how your post will appear on each platform
            </p>
          </div>
          <Button variant="outline" onClick={closePreview}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Close Preview
          </Button>
        </div>

        {/* Enhanced Platform Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mr-4">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              Platforms ({previewData.selectedPlatforms.length}):
            </span>
          </div>
          {previewData.selectedPlatforms.map((platformId) => {
            const platform = platforms.find((p) => p.id === platformId);
            if (!platform) return null;

            const IconComponent = platform.icon;
            const isActive = selectedPlatformView === platform.id;

            return (
              <Button
                key={platform.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPlatformView(platform.id)}
                className={`flex items-center gap-2 transition-all ${
                  isActive ? "shadow-md scale-105" : "hover:scale-102"
                }`}
              >
                <IconComponent className="h-4 w-4" />
                {platform.name}
                {/* Show warning if content has issues for this platform */}
                {(() => {
                  const hasIssues =
                    (platform.limit && textContent.length > platform.limit) ||
                    (platform.features.mediaLimit &&
                      previewData.uploadedFiles.length >
                        platform.features.mediaLimit);
                  return hasIssues ? (
                    <span className="w-2 h-2 bg-red-500 rounded-full ml-1"></span>
                  ) : null;
                })()}
              </Button>
            );
          })}
          <Button
            variant={selectedPlatformView === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPlatformView(null)}
            className="ml-2"
          >
            <Globe className="h-4 w-4 mr-2" />
            All Platforms
          </Button>
        </div>
      </div>

      {/* Enhanced Preview Content */}
      <div className="space-y-8">
        {selectedPlatformView ? (
          // Single platform detailed view
          <div className="max-w-2xl mx-auto">
            {renderPlatformPreview(
              platforms.find((p) => p.id === selectedPlatformView)!
            )}
          </div>
        ) : (
          // All platforms grid view
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {previewData.selectedPlatforms.map((platformId) => {
              const platform = platforms.find((p) => p.id === platformId);
              return platform ? renderPlatformPreview(platform) : null;
            })}
          </div>
        )}

        {/* Enhanced Summary Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              Post Summary & Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {previewData.selectedPlatforms.length}
                </p>
                <p className="text-sm text-blue-700 font-medium">Platforms</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {textContent.length}
                </p>
                <p className="text-sm text-green-700 font-medium">Characters</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {previewData.uploadedFiles?.length || 0}
                </p>
                <p className="text-sm text-purple-700 font-medium">
                  Media Files
                </p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">
                  {extractHashtags(textContent).length}
                </p>
                <p className="text-sm text-orange-700 font-medium">Hashtags</p>
              </div>
            </div>

            {/* Platform Compatibility Check */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Platform Compatibility
              </h3>
              <div className="grid gap-3">
                {previewData.selectedPlatforms.map((platformId) => {
                  const platform = platforms.find((p) => p.id === platformId);
                  if (!platform) return null;

                  const IconComponent = platform.icon;
                  const isTextOverLimit =
                    platform.limit && textContent.length > platform.limit;
                  const isMediaOverLimit =
                    platform.features.mediaLimit &&
                    previewData.uploadedFiles.length >
                      platform.features.mediaLimit;
                  const hasIssues = isTextOverLimit || isMediaOverLimit;

                  return (
                    <div
                      key={platform.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        hasIssues
                          ? "bg-red-50 border-red-200"
                          : "bg-green-50 border-green-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${platform.color}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{platform.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {hasIssues
                              ? "Has compatibility issues"
                              : "Ready to publish"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {hasIssues ? (
                          <Badge variant="destructive" className="text-xs">
                            Issues Found
                          </Badge>
                        ) : (
                          <Badge
                            variant="default"
                            className="text-xs bg-green-600"
                          >
                            ✓ Compatible
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Schedule Information */}
            {previewData.scheduleDate && previewData.scheduleTime && (
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Scheduled Publication
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-medium text-blue-800">
                    {new Date(
                      `${previewData.scheduleDate}T${previewData.scheduleTime}`
                    ).toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Publishing to {previewData.selectedPlatforms.length}{" "}
                    platform(s)
                  </p>
                </div>
              </div>
            )}

            {/* Content Analysis */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-3">Content Analysis</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground mb-2">
                    Engagement Elements
                  </p>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2">
                      <Hash className="h-3 w-3" />
                      <span>
                        {extractHashtags(textContent).length} hashtags
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <AtSign className="h-3 w-3" />
                      <span>
                        {extractMentions(textContent).length} mentions
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ImageIcon className="h-3 w-3" />
                      <span>
                        {previewData.uploadedFiles?.length || 0} media files
                      </span>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground mb-2">
                    Content Stats
                  </p>
                  <ul className="space-y-1">
                    <li className="flex justify-between">
                      <span>Words:</span>
                      <span className="font-medium">
                        {
                          textContent
                            .split(/\s+/)
                            .filter((word) => word.length > 0).length
                        }
                      </span>
                    </li>
                    <li className="flex justify-between">
                      <span>Characters:</span>
                      <span className="font-medium">{textContent.length}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Estimated read time:</span>
                      <span className="font-medium">
                        {Math.ceil(
                          textContent
                            .split(/\s+/)
                            .filter((word) => word.length > 0).length / 200
                        )}{" "}
                        min
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t">
              <div className="flex flex-wrap gap-3">
                <Button onClick={closePreview} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Editor
                </Button>
                <Button
                  onClick={() => {
                    // This would typically trigger the actual publishing process
                    console.log("Publishing post...", previewData);
                    alert("Publishing functionality would be implemented here");
                  }}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={previewData.selectedPlatforms.some((platformId) => {
                    const platform = platforms.find((p) => p.id === platformId);
                    return (
                      platform &&
                      ((platform.limit &&
                        textContent.length > platform.limit) ||
                        (platform.features.mediaLimit &&
                          previewData.uploadedFiles.length >
                            platform.features.mediaLimit))
                    );
                  })}
                >
                  {previewData.scheduleDate && previewData.scheduleTime ? (
                    <>
                      <Clock className="mr-2 h-4 w-4" />
                      Schedule Post
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 mr-2 bg-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                      Publish Now
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    // Save as draft functionality
                    console.log("Saving as draft...", previewData);
                    alert(
                      "Save as draft functionality would be implemented here"
                    );
                  }}
                >
                  Save as Draft
                </Button>
              </div>
            </div>

            {/* Debug Info (development only) */}
            {process.env.NODE_ENV === "development" && (
              <div className="pt-4 border-t">
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                    🔧 Debug Information (Development Only)
                  </summary>
                  <div className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                    <pre>{JSON.stringify(previewData, null, 2)}</pre>
                  </div>
                </details>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform-specific recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-yellow-100 rounded-full">
                <div className="h-5 w-5 text-yellow-600">💡</div>
              </div>
              Optimization Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {previewData.selectedPlatforms.map((platformId) => {
                const platform = platforms.find((p) => p.id === platformId);
                if (!platform) return null;

                const IconComponent = platform.icon;
                const recommendations = [];

                // Generate platform-specific recommendations
                if (
                  platform.limit &&
                  textContent.length > platform.limit * 0.8
                ) {
                  recommendations.push(
                    "Consider shortening your content for better engagement"
                  );
                }

                if (
                  platform.features.hashtags &&
                  extractHashtags(textContent).length === 0
                ) {
                  recommendations.push(
                    "Add relevant hashtags to increase discoverability"
                  );
                }

                if (
                  platform.name === "Instagram" &&
                  previewData.uploadedFiles.length === 0
                ) {
                  recommendations.push(
                    "Instagram posts perform better with visual content"
                  );
                }

                if (
                  platform.name === "LinkedIn" &&
                  !textContent.includes("?")
                ) {
                  recommendations.push(
                    "Consider adding a question to encourage engagement"
                  );
                }

                if (platform.name === "X" && textContent.length < 100) {
                  recommendations.push(
                    "Longer tweets (up to 280 chars) often get more engagement"
                  );
                }

                if (recommendations.length === 0) {
                  recommendations.push(
                    "Your content looks great for this platform!"
                  );
                }

                return (
                  <div key={platform.id} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-1.5 rounded-full ${platform.color}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <h3 className="font-semibold">
                        {platform.name} Recommendations
                      </h3>
                    </div>
                    <ul className="space-y-1 text-sm">
                      {recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
