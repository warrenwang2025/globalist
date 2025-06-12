"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  { id: 1, name: "X", icon: Twitter, color: "bg-black text-white", limit: 280 },
  {
    id: 2,
    name: "LinkedIn",
    icon: Linkedin,
    color: "bg-blue-600 text-white",
    limit: 3000,
  },
  {
    id: 3,
    name: "Instagram",
    icon: Instagram,
    color: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
    limit: 2200,
  },
  {
    id: 4,
    name: "YouTube",
    icon: Youtube,
    color: "bg-red-600 text-white",
    limit: 5000,
  },
  {
    id: 5,
    name: "TikTok",
    icon: SiTiktok,
    color: "bg-blue-300 text-white",
    limit: 2200,
  },
  {
    id: 6,
    name: "Personal",
    icon: Globe,
    color: "bg-gray-600 text-white",
    limit: null,
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
      // Get data from URL params
      const data = searchParams?.get("data");

      if (data) {
        const parsedData = JSON.parse(decodeURIComponent(data));
        console.log("Parsed preview data:", parsedData); // Debug log

        setPreviewData(parsedData);

        // Set default platform view to first selected platform
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
  // Function to format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Function to close preview window
  const closePreview = () => {
    if (window.opener) {
      window.close();
    } else {
      // If not opened in popup, go back in history
      window.history.back();
    }
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

  const renderPlatformPreview = (platform: (typeof platforms)[0]) => {
    const IconComponent = platform.icon;
    const isOverLimit = platform.limit && textContent.length > platform.limit;
    const remainingChars = platform.limit
      ? platform.limit - textContent.length
      : null;

    return (
      <Card key={platform.id} className="w-full max-w-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-full ${platform.color}`}>
                <IconComponent className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg">{platform.name}</CardTitle>
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
        <CardContent className="space-y-3">
          {previewData.title && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                Title
              </h3>
              <p className="font-medium">{previewData.title}</p>
            </div>
          )}

          <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">
              Content
            </h3>
            <div
              className={`prose prose-sm max-w-none ${
                isOverLimit ? "text-red-600" : ""
              }`}
              dangerouslySetInnerHTML={{ __html: previewData.content }}
            />
          </div>

          {previewData.uploadedFiles &&
            previewData.uploadedFiles.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                  Media ({previewData.uploadedFiles.length})
                </h3>
                <div className="space-y-2">
                  {previewData.uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-100 rounded p-2 text-xs"
                    >
                      {file.type.startsWith("image/") ? (
                        <ImageIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                      ) : file.type.startsWith("video/") ? (
                        <FileVideo className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <Video className="h-4 w-4 text-gray-500 flex-shrink-0" />
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

          {previewData.scheduleDate && previewData.scheduleTime && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-1">
                Scheduled
              </h3>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(
                    `${previewData.scheduleDate}T${previewData.scheduleTime}`
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="pt-2 border-t">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Characters: {textContent.length}</span>
              {platform.limit && (
                <span className={isOverLimit ? "text-red-500 font-medium" : ""}>
                  Limit: {platform.limit}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Post Preview</h1>
            <p className="text-muted-foreground">
              Preview how your post will appear on different platforms
            </p>
          </div>
          <Button variant="outline" onClick={closePreview}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Close Preview
          </Button>
        </div>

        {/* Platform Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {previewData.selectedPlatforms.map((platformId) => {
            const platform = platforms.find((p) => p.id === platformId);
            if (!platform) return null;

            const IconComponent = platform.icon;
            return (
              <Button
                key={platform.id}
                variant={
                  selectedPlatformView === platform.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedPlatformView(platform.id)}
                className="flex items-center gap-2"
              >
                <IconComponent className="h-4 w-4" />
                {platform.name}
              </Button>
            );
          })}
          <Button
            variant={selectedPlatformView === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPlatformView(null)}
          >
            All Platforms
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="space-y-6">
        {selectedPlatformView ? (
          // Single platform view
          <div className="flex justify-center">
            {renderPlatformPreview(
              platforms.find((p) => p.id === selectedPlatformView)!
            )}
          </div>
        ) : (
          // All platforms view
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previewData.selectedPlatforms.map((platformId) => {
              const platform = platforms.find((p) => p.id === platformId);
              return platform ? renderPlatformPreview(platform) : null;
            })}
          </div>
        )}

        {/* Summary Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Post Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Platforms</p>
                <p className="font-semibold">
                  {previewData.selectedPlatforms.length}
                </p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Characters</p>
                <p className="font-semibold">{textContent.length}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Media Files</p>
                <p className="font-semibold">
                  {previewData.uploadedFiles?.length || 0}
                </p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Status</p>
                <p className="font-semibold">
                  {previewData.scheduleDate && previewData.scheduleTime
                    ? "Scheduled"
                    : "Ready to Publish"}
                </p>
              </div>
            </div>

            {previewData.scheduleDate && previewData.scheduleTime && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-1">
                  Scheduled Publication
                </p>
                <p className="font-medium">
                  {new Date(
                    `${previewData.scheduleDate}T${previewData.scheduleTime}`
                  ).toLocaleString()}
                </p>
              </div>
            )}

            {/* Debug Info (remove in production) */}
            {process.env.NODE_ENV === "development" && (
              <div className="pt-4 border-t">
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground">
                    Debug Info
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(previewData, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
