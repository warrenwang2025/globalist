import { useState, useEffect } from "react";
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

interface Event {
  id: number;
  title: string;
  date: Date;
  type: string;
  duration?: number;
  attendees?: number;
  description: string;
}

interface EditEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onUpdateEvent: (event: Event) => void;
}

export function EditEventDialog({
  open,
  onOpenChange,
  event,
  onUpdateEvent,
}: EditEventDialogProps) {
  const { toast } = useToast();
  const [editedEvent, setEditedEvent] = useState({
    title: "",
    date: "",
    time: "",
    type: "meeting",
    duration: 60,
    attendees: 1,
    description: "",
  });

  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.date);
      setEditedEvent({
        title: event.title,
        date: eventDate.toISOString().split('T')[0],
        time: eventDate.toTimeString().slice(0, 5),
        type: event.type,
        duration: event.duration || 60,
        attendees: event.attendees || 1,
        description: event.description,
      });
    }
  }, [event]);

  const handleUpdateEvent = () => {
    if (!editedEvent.title || !editedEvent.date || !editedEvent.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!event) return;

    const eventDate = new Date(`${editedEvent.date}T${editedEvent.time}`);
    const updatedEvent: Event = {
      ...event,
      title: editedEvent.title,
      date: eventDate,
      type: editedEvent.type,
      duration: editedEvent.duration,
      attendees: editedEvent.attendees,
      description: editedEvent.description,
    };

    onUpdateEvent(updatedEvent);
    onOpenChange(false);

    toast({
      title: "Event Updated",
      description: `${updatedEvent.title} has been updated successfully.`,
    });
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update your meeting or event details
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Event title"
            value={editedEvent.title}
            onChange={(e) =>
              setEditedEvent({ ...editedEvent, title: e.target.value })
            }
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={editedEvent.date}
              onChange={(e) =>
                setEditedEvent({ ...editedEvent, date: e.target.value })
              }
            />
            <Input
              type="time"
              value={editedEvent.time}
              onChange={(e) =>
                setEditedEvent({ ...editedEvent, time: e.target.value })
              }
            />
          </div>
          <Select
            value={editedEvent.type}
            onValueChange={(value) =>
              setEditedEvent({ ...editedEvent, type: value })
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
              value={editedEvent.duration}
              onChange={(e) =>
                setEditedEvent({
                  ...editedEvent,
                  duration: parseInt(e.target.value) || 60,
                })
              }
            />
            <Input
              type="number"
              placeholder="Attendees"
              value={editedEvent.attendees}
              onChange={(e) =>
                setEditedEvent({
                  ...editedEvent,
                  attendees: parseInt(e.target.value) || 1,
                })
              }
            />
          </div>
          <Textarea
            placeholder="Event description"
            value={editedEvent.description}
            onChange={(e) =>
              setEditedEvent({ ...editedEvent, description: e.target.value })
            }
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateEvent}>Update Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}