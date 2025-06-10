import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface NewEvent {
  title: string;
  date: string;
  time: string;
  type: string;
  duration: number;
  attendees: number;
  description: string;
}

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateEvent: (event: NewEvent) => void;
}

export function CreateEventDialog({
  open,
  onOpenChange,
  onCreateEvent,
}: CreateEventDialogProps) {
  const { toast } = useToast();
  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: "",
    date: "",
    time: "",
    type: "meeting",
    duration: 60,
    attendees: 1,
    description: "",
  });

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    onCreateEvent(newEvent);
    setNewEvent({
      title: "",
      date: "",
      time: "",
      type: "meeting",
      duration: 60,
      attendees: 1,
      description: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Schedule a new meeting or event
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Event title"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: e.target.value })
              }
            />
            <Input
              type="time"
              value={newEvent.time}
              onChange={(e) =>
                setNewEvent({ ...newEvent, time: e.target.value })
              }
            />
          </div>
          <Select
            value={newEvent.type}
            onValueChange={(value) =>
              setNewEvent({ ...newEvent, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="meeting">Meeting</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="presentation">Presentation</SelectItem>
            </SelectContent>
          </Select>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Duration (min)"
              value={newEvent.duration}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  duration: parseInt(e.target.value) || 60,
                })
              }
            />
            <Input
              type="number"
              placeholder="Attendees"
              value={newEvent.attendees}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  attendees: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>
          <Textarea
            placeholder="Event description"
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateEvent}>Create Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}