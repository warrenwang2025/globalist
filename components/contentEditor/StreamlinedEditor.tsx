"use client";

import { useState, useEffect } from "react";
import { EditorCanvas } from "./EditorCanvas";
import { AIAssistantModal } from "./AIAssistantModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, FileText, Sparkles, CheckCircle, Send } from "lucide-react";
import type { AnyBlock } from "@/types/editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Country } from "country-state-city"; // Import country library
import axios from "axios";
import { set } from "mongoose";

interface User {
  isPremium: boolean;
}

interface StreamlinedEditorProps {
  user: User;
  platforms: number[];
  onSave?: (title: string, blocks: AnyBlock[]) => Promise<void>;
  onPreview?: (title: string, blocks: AnyBlock[]) => void;
  onPublish?: () => void;
  onContentChange?: (
    title: string,
    blocks: AnyBlock[],
    category: string[],
    country: string[],
    type: string,
    imageBase64: string | null
  ) => void;
  initialTitle?: string;
  initialBlocks?: AnyBlock[];
}

export function StreamlinedEditor({
  user,
  onSave,
  onPreview,
  onPublish,
  platforms,
  onContentChange,
  initialTitle = "",
  initialBlocks = [],
}: StreamlinedEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [type, setType] = useState("");
  const [blocks, setBlocks] = useState<AnyBlock[]>(initialBlocks);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [countries, setCountries] = useState<
    { label: string; value: string }[]
  >([]); // Countries state
  const [categories, setCategories] = useState<
    { label: string; value: string; name: string; _id: string }[]
  >([]); // Categories state
  const [selectedCountry, setSelectedCountry] = useState<string>(""); // Selected country
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Image preview state
  const [imageBase64, setImageBase64] = useState<any | null>(null as any); // Image base64 string state

  const { toast } = useToast();

  // Function to handle image upload and convert it to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Set the base64 encoded image string
        if (reader.result) {
          setImageBase64(file);
          // Set the image preview URL
          setImagePreview(URL.createObjectURL(file));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Update the onValueChange to handle multiple selections
  const handleCategoryChange = (value: string) => {
    setSelectedCategory([value]);
  };

  // Sync changes back to parent component with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onContentChange?.(
        title,
        blocks,
        selectedCategory,
        [selectedCountry],
        type,
        imageBase64
      );
    }, 300); // Debounce to prevent excessive updates

    return () => clearTimeout(timeoutId);
  }, [title, blocks, onContentChange]);

  // Fetch categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_GLOBALIST_LIVE_URL}/categories?page=1&perPage=9999`
      );

      setCategories(
        data?.response?.details?.map((category: any) => ({
          label: category.name,
          value: category._id,
        }))
      );
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to fetch Categories.",
        variant: "destructive",
      });
    }
  };

  // Fetch countries and categories
  useEffect(() => {
    const fetchedCountries = Country.getAllCountries().map((country) => ({
      label: country.name,
      value: country.isoCode,
    }));
    setCountries(fetchedCountries);
    getAllCategories();
  }, []);

  const handleSave = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your content",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await onSave?.(title, blocks);
      setLastSaved(new Date());
      toast({
        title: "Saved",
        description: "Your content has been saved successfully",
      });
    } catch (error) {
      console.error("Save failed:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title to preview your content",
        variant: "destructive",
      });
      return;
    }
    onPreview?.(title, blocks);
  };

  const handlePublish = () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title to publish your content",
        variant: "destructive",
      });
      return;
    }
    onPublish?.();
  };

  const getWordCount = () => {
    return blocks
      .filter((block) => block.type === "text" || block.type === "heading")
      .reduce((count, block) => {
        let text = "";
        if (block.type === "text" && block.content?.text) {
          text = block.content.text;
        } else if (block.type === "heading" && block.content?.text) {
          text = block.content.text;
        }
        if (text.trim()) {
          const words = text
            .trim()
            .split(/\s+/)
            .filter((word: string) => word.length > 0);
          return count + words.length;
        }
        return count;
      }, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="w-full max-w-full px-2 sm:px-4 md:px-8 py-6 mx-auto">
        <div className="w-full mx-auto">
          {/* Header - Now part of scrollable content */}
          <div className="border-b bg-card/50 backdrop-blur-sm mb-6 -mx-2 sm:-mx-4 md:-mx-8 px-2 sm:px-4 md:px-8 py-4">
            <div className="flex items-center justify-between flex-wrap gap-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h1 className="text-xl font-semibold">Content Editor</h1>
                </div>
                {user.isPremium && (
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <div className="flex flex-col gap-2 items-end sm:items-center sm:gap-0 sm:flex-row">
                {/* Stats */}
                <div className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{getWordCount()} words</span>
                  </div>
                  {lastSaved && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Saved {lastSaved.toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
                {/* Actions */}
                <div
                  className="
                    grid grid-cols-2 gap-3 items-center min-w-[200px]
                    sm:flex sm:flex-row sm:gap-x-3 sm:w-auto sm:min-w-0
                  "
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreview}
                    disabled={!title.trim()}
                    className="
                      h-8 px-2 text-xs sm:text-sm sm:h-9 sm:px-4
                      w-full sm:w-auto
                    "
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving || !title.trim()}
                    className="
                      h-8 px-2 text-xs sm:text-sm sm:h-9 sm:px-4
                      w-full sm:w-auto
                    "
                  >
                    <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handlePublish}
                    disabled={!title.trim()}
                    className="
                      col-span-2 w-full h-8 px-2 text-xs sm:text-sm sm:h-9 sm:px-4
                      sm:col-span-1 sm:w-auto
                    "
                  >
                    <Send className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    Publish Now
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Title Input */}
          <Card className="p-4 sm:p-6 mb-6 w-full">
            <Input
              placeholder="Enter your title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold border-none bg-transparent placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 p-0"
            />
          </Card>

          {/* Editor Canvas */}
          <Card className="p-4 sm:p-6 min-h-[400px] w-full mb-6">
            <EditorCanvas
              initialBlocks={blocks}
              onContentChange={setBlocks}
              className="focus-within:ring-2 focus-within:ring-primary/20 rounded-lg"
            />
          </Card>

          {platforms.length === 0 && (
            <>
              {/* Type Dropdown */}
              <Card className="mb-6 p-4 sm:p-6">
                <CardHeader>
                  <CardTitle className="text-lg">Select Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key={"Blog"} value={"blog"}>
                        Blog
                      </SelectItem>
                      <SelectItem key={"News"} value={"news"}>
                        News
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Country Dropdown */}
              <Card className="mb-6 p-4 sm:p-6">
                <CardHeader>
                  <CardTitle className="text-lg">Select Country</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedCountry}
                    onValueChange={setSelectedCountry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Category Dropdown */}
              <Card className="mb-6  p-4 sm:p-6">
                <CardHeader>
                  <CardTitle className="text-lg">Select Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedCategory[0] || ""}
                    onValueChange={(value) => handleCategoryChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Image Uploader */}
              <Card className="mb-6 p-4 sm:p-6">
                <CardHeader>
                  <CardTitle className="text-lg">Upload Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full mb-4 p-2 border rounded"
                  />
                  {imagePreview && (
                    <div className="mt-4">
                      <h3 className="font-semibold text-sm">Image Preview:</h3>
                      <img
                        src={imagePreview}
                        alt="Uploaded Preview"
                        className="mt-2 max-w-full h-auto"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
          {/* Empty State */}
          {blocks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Start Writing</h3>
                <p className="text-sm">
                  Click anywhere to add your first block, or use the AI
                  assistant to generate content
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating AI Assistant */}
      <AIAssistantModal
        articleContent={blocks
          .map((block) => {
            switch (block.type) {
              case "text":
              case "heading":
              case "quote":
                return (block.content as any).text || "";
              case "list":
                return (block.content as any).items?.join("\n") || "";
              default:
                return "";
            }
          })
          .join("\n\n")}
        headline={title}
        onInsertBlocks={(aiBlocks) => {
          // Ensure each new block has a unique id
          const newBlocks = aiBlocks.map((b, i) => ({
            ...b,
            id:
              b.id && typeof b.id === "string"
                ? b.id
                : Math.random().toString(36).substr(2, 9),
            order: i,
          }));
          setBlocks(newBlocks);
          // Clear selection state after insertion
          // Note: Selection state is managed by EditorCanvas internally
          toast({
            title: "AI Content Inserted",
            description: "The generated content has been added to your editor.",
          });
        }}
      />
    </div>
  );
}
