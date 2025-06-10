import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Trash2 } from "lucide-react";

interface CalendarFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterType: string;
  onFilterChange: (type: string) => void;
  selectedItems: number[];
  onBulkDelete: () => void;
}

export function CalendarFilters({
  searchQuery,
  onSearchChange,
  filterType,
  onFilterChange,
  selectedItems,
  onBulkDelete,
}: CalendarFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 gap-2 w-full sm:w-auto">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events and posts..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={onFilterChange}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="meeting">Meetings</SelectItem>
                <SelectItem value="event">Events</SelectItem>
                <SelectItem value="posts">Posts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedItems.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {selectedItems.length} selected
              </Badge>
              <Button variant="outline" size="sm" onClick={onBulkDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}