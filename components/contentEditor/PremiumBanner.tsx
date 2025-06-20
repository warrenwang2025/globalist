import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

interface PremiumBannerProps {
  onUpgrade: () => void;
}

export function PremiumBanner({ onUpgrade }: PremiumBannerProps) {
  return (
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
              Get access to content generation, SEO optimization, and advanced AI tools
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={onUpgrade}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Upgrade Now
        </Button>
      </div>
    </Card>
  );
}