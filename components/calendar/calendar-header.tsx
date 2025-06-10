"use client";
import { Button } from "@/components/ui/button";
import { Download, Calendar as CalendarIcon, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
interface CalendarHeaderProps {
  onExportSchedule: () => void;
  onOpenEventDialog: () => void;
  onOpenPostDialog: () => void;
}

export function CalendarHeader({
  onExportSchedule,
  onOpenEventDialog,
}: CalendarHeaderProps) {
  const router = useRouter();
  function handleClickPost() {
    router.push("/dashboard/distribution");
  }
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold">Schedule Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage your events, meetings, and scheduled content all in one place
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onExportSchedule}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button variant="outline" onClick={onOpenEventDialog}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Add Event
        </Button>
        <Button onClick={() => handleClickPost()}>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Post
        </Button>
      </div>
    </div>
  );
}
