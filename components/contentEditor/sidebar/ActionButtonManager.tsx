"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActionButtons } from "../ActionButtons";
import { Trash2, ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import type { ActionButton } from "@/types/editor";

interface ActionButtonManagerProps {
  actionButtons: ActionButton[];
  onActionButtonsChange: (buttons: ActionButton[]) => void;
  onRemoveActionButton: (buttonId: string) => void;
  onClearAllActionButtons: () => void;
  onReorderActionButtons: (startIndex: number, endIndex: number) => void;
  onMoveActionButtonUp: (buttonId: string) => void;
  onMoveActionButtonDown: (buttonId: string) => void;
}

export function ActionButtonManager({
  actionButtons,
  onActionButtonsChange,
  onRemoveActionButton,
  onClearAllActionButtons,
  onReorderActionButtons,
  onMoveActionButtonUp,
  onMoveActionButtonDown,
}: ActionButtonManagerProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
          Action Buttons ({actionButtons.length})
        </h3>
        {actionButtons.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAllActionButtons}
            className="text-xs text-destructive hover:text-destructive"
          >
            Clear All
          </Button>
        )}
      </div>

      <ActionButtons
        buttons={actionButtons}
        onButtonsChange={onActionButtonsChange}
      />

      {/* Action Buttons List */}
      {actionButtons.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">
            Current Buttons:
          </h4>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {actionButtons.map((button, index) => {
              const isFirst = index === 0;
              const isLast = index === actionButtons.length - 1;

              return (
                <Card key={button.id} className="p-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <GripVertical className="h-3 w-3 text-muted-foreground" />
                      <Badge variant="outline" className="text-xs">
                        {button.type.replace("_", " ")}
                      </Badge>
                      <span className="text-xs truncate">{button.label}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Move Up Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMoveActionButtonUp(button.id)}
                        disabled={isFirst}
                        className="p-1 h-auto hover:bg-primary/20"
                        title="Move up"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </Button>

                      {/* Move Down Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onMoveActionButtonDown(button.id)}
                        disabled={isLast}
                        className="p-1 h-auto hover:bg-primary/20"
                        title="Move down"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveActionButton(button.id)}
                        className="p-1 h-auto hover:bg-destructive hover:text-destructive-foreground"
                        title="Remove button"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
