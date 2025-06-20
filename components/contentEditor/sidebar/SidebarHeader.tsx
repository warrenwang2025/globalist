"use client";

import { Button } from "@/components/ui/button";
import { PanelRightClose } from "lucide-react";

interface SidebarHeaderProps {
  onClose: () => void;
}

export function SidebarHeader({ onClose }: SidebarHeaderProps) {
  return (
    <div className="p-4 border-b">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm">Tools</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="p-1 h-auto"
        >
          <PanelRightClose className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}