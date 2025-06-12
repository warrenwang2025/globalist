"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import type { AnyBlock } from "@/types/editor";

interface ListBlockProps {
  block: Extract<AnyBlock, { type: "list" }>;
  isSelected: boolean;
  onUpdate: (content: any) => void;
}

export function ListBlock({ block, isSelected, onUpdate }: ListBlockProps) {
  const [items, setItems] = useState(block.content.items || [""]);
  const [ordered, setOrdered] = useState(block.content.ordered || false);

  useEffect(() => {
    setItems(block.content.items || [""]);
    setOrdered(block.content.ordered || false);
  }, [block.content]);

  const updateContent = (newItems: string[], newOrdered: boolean) => {
    onUpdate({ items: newItems, ordered: newOrdered });
  };

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
    updateContent(newItems, ordered);
  };

  const addItem = () => {
    const newItems = [...items, ""];
    setItems(newItems);
    updateContent(newItems, ordered);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = items.filter((_, i) => i !== index);
      setItems(newItems);
      updateContent(newItems, ordered);
    }
  };

  const toggleOrdered = (checked: boolean) => {
    setOrdered(checked);
    updateContent(items, checked);
  };

  const ListTag = ordered ? "ol" : "ul";

  return (
    <div className="space-y-4">
      {isSelected && (
        <div className="flex items-center space-x-2">
          <Switch
            id="ordered-list"
            checked={ordered}
            onCheckedChange={toggleOrdered}
          />
          <Label htmlFor="ordered-list">Ordered list</Label>
        </div>
      )}
      
      <ListTag className={ordered ? "list-decimal list-inside space-y-2" : "list-disc list-inside space-y-2"}>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder="List item..."
              className="border-none focus:ring-0 focus:border-none p-0"
            />
            {isSelected && items.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(index)}
                className="p-1 h-auto hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </li>
        ))}
      </ListTag>
      
      {isSelected && (
        <Button
          variant="ghost"
          size="sm"
          onClick={addItem}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add item
        </Button>
      )}
    </div>
  );
}