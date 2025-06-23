"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
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
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import type { Event } from "@/types/calendar";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateEvent: (event: Omit<Event, 'id'>) => void;
}

export function CreateEventDialog({
  open,
  onOpenChange,
  onCreateEvent,
}: CreateEventDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "event" as "event" | "meeting",
    duration: "",
    attendees: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.time) {
      return;
    }

    const eventDate = new Date(`${formData.date}T${formData.time}`);
    
    const newEvent: Omit<Event, 'id'> = {
      title: formData.title,
      description: formData.description,
      date: eventDate,
      type: formData.type,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      attendees: formData.attendees ? parseInt(formData.attendees) : undefined,
    };

    onCreateEvent(newEvent);
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      type: "event",
      duration: "",
      attendees: "",
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md sm:max-w-2xl mx-auto px-4 sm:px-6 py-6 rounded-xl shadow-lg overflow-y-auto max-h-[90vh]" >
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg sm:text-xl">Create New Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Event Type */}
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">Event Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "event" | "meeting") =>
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="event">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Event
                  </div>
                </SelectItem>
                <SelectItem value="meeting">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Meeting
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter event title"
              className="w-full"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, description: e.target.value }))
              }
              placeholder="Enter event description"
              rows={3}
              className="w-full resize-none"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, date: e.target.value }))
                }
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm font-medium">
                Time <span className="text-red-500">*</span>
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, time: e.target.value }))
                }
                className="w-full"
              />
            </div>
          </div>

          {/* Duration and Attendees */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
                Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, duration: e.target.value }))
                }
                placeholder="60"
                min="1"
                className="w-full"
              />
            </div>
            
            {formData.type === "meeting" && (
              <div className="space-y-2">
                <Label htmlFor="attendees" className="text-sm font-medium">
                  Attendees
                </Label>
                <Input
                  id="attendees"
                  type="number"
                  value={formData.attendees}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, attendees: e.target.value }))
                  }
                  placeholder="5"
                  min="1"
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!formData.title || !formData.date || !formData.time}
              className="w-full sm:w-auto sm:flex-1 order-1 sm:order-2"
            >
              Create Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
