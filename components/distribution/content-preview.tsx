
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Block {
  id: string;
  type: string;
  content: any;
}

interface ContentPreviewProps {
  title: string;
  blocks: Block[];
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ title, blocks }) => (
  <Card className="bg-card/80">
    <CardContent className="py-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="space-y-4">
        {blocks.map((block) => {
          if (block.type === "heading") {
            return (
              <h3 key={block.id} className="text-xl font-semibold">
                {block.content.text}
              </h3>
            );
          }
          if (block.type === "text") {
            return (
              <p key={block.id} className="text-base">
                {block.content.text}
              </p>
            );
          }
          return null;
        })}
      </div>
    </CardContent>
  </Card>
);

export default ContentPreview;