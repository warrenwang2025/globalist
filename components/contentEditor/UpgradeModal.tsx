import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade: () => void;
}

export function UpgradeModal({ open, onOpenChange, onUpgrade }: UpgradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              AI-powered content generation
            </li>
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
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Maybe Later
          </Button>
          <Button
            onClick={onUpgrade}
            className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700"
          >
            <Crown className="mr-2 h-4 w-4" />
            Upgrade Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}