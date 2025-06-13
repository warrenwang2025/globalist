"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Brain, Wand2, Crown, Lock } from "lucide-react";

export default function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [user, setUser] = useState({
    isPremium: false,
  });
  const router = useRouter();

  // Simulate fetching user data - replace with your actual auth logic
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = {
          isPremium: false, // Set this based on your user's subscription status
        };
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const generateSuggestions = () => {
    // Simulated AI response
    setSuggestions([
      "10 Tips for Effective Social Media Marketing",
      "How to Boost Your Online Presence",
      "The Ultimate Guide to Content Strategy",
    ]);
  };

  const handleOptimizeSEO = () => {
    if (!user.isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    // Premium user functionality
    console.log("Optimizing SEO...");
    // Add your SEO optimization logic here
  };

  const handleContentImprover = () => {
    if (!user.isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    // Premium user functionality
    console.log("Improving content...");
    // Add your content improvement logic here
  };

  const handleHeadlineGenerator = () => {
    if (!user.isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    // Premium user functionality
    console.log("Generating headlines...");
    // Add your headline generation logic here
  };

  const handleGetPlus = () => {
    router.push("/pricing");
  };

  const handleUpgradeFromModal = () => {
    setShowUpgradeModal(false);
    router.push("/pricing");
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold">AI Assistant</h1>
          {user.isPremium && <Crown className="h-6 w-6 text-yellow-500" />}
        </div>
      </div>

      {/* Premium Status Banner for Free Users */}
      {!user.isPremium && (
        <Card className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                <Crown className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100">
                  Unlock Premium AI Features
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Get access to SEO optimization, content improvement, and
                  advanced Analytics fucntions
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleGetPlus}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Upgrade Now
            </Button>
          </div>
        </Card>
      )}

      {/* Top Grid: Content + Tools */}
      <div className="grid gap-6 md:gap-8 grid-cols-1 lg:grid-cols-[2fr_1fr] items-start">
        {/* Left column */}
        <Card className="p-4 md:p-6 h-full">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Content Topic</label>
              <Textarea
                placeholder="Describe your content topic or idea..."
                className="mt-2"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="flex-1" onClick={generateSuggestions}>
                <Brain className="mr-2 h-4 w-4" />
                Generate Ideas
              </Button>
              <Button
                variant="outline"
                className="flex-1 relative"
                onClick={handleOptimizeSEO}
              >
                <div className="flex items-center w-full">
                  {!user.isPremium && (
                    <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  <div className="flex justify-center w-full">
                    <Wand2 className="mr-2 h-4 w-4" />
                    Optimize SEO
                  </div>
                  {!user.isPremium && (
                    <Crown className="ml-2 h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </Button>
            </div>
          </div>
        </Card>

        {/* Right column */}
        <Card className="p-4 md:p-6 h-full">
          <div>
            <h2 className="text-lg font-semibold mb-4">Quick Tools</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Wand2 className="mr-2 h-4 w-4" />
                Headline Generator
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start relative"
                onClick={handleContentImprover}
              >
                <div className="flex items-center w-full">
                  {!user.isPremium && (
                    <Lock className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  <Brain className="mr-2 h-4 w-4" />
                  <span className="flex-1 text-left">Content Improver</span>
                  {!user.isPremium && (
                    <Crown className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Suggestions Section */}
      {suggestions.length > 0 && (
        <Card className="mt-6 md:mt-8 p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-4">Suggestions</h2>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <p>{suggestion}</p>
                {user.isPremium && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleOptimizeSEO}
                    >
                      <Wand2 className="mr-1 h-3 w-3" />
                      Optimize
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleContentImprover}
                    >
                      <Brain className="mr-1 h-3 w-3" />
                      Improve
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Upgrade Modal */}
      <Dialog open={showUpgradeModal} onOpenChange={setShowUpgradeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-full">
                <Crown className="h-5 w-5 text-yellow-600" />
              </div>
              <DialogTitle>Premium Feature</DialogTitle>
            </div>
            <DialogDescription className="text-left">
              This feature is only available for Premium users. Upgrade your
              plan to unlock:
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                Advanced SEO optimization tools
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                AI-powered content improvement
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                Priority AI processing
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                Advanced analytics access
              </li>
            </ul>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowUpgradeModal(false)}
              className="w-full sm:w-auto"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleUpgradeFromModal}
              className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700"
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
