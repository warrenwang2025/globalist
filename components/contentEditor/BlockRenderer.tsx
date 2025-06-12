"use client";

import { useState, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Upload, Link2, Play, Image as ImageIcon } from "lucide-react";
import type { AnyBlock } from "@/types/editor";

interface BlockRendererProps {
  block: AnyBlock;
  isSelected: boolean;
  onUpdate: (content: any) => void;
}

export function BlockRenderer({ block, isSelected, onUpdate }: BlockRendererProps) {
  const [isEditing, setIsEditing] = useState(false);

  const renderBlock = () => {
    switch (block.type) {
      case 'text':
        return <TextBlockRenderer block={block} onUpdate={onUpdate} isSelected={isSelected} />;
      case 'heading':
        return <HeadingBlockRenderer block={block} onUpdate={onUpdate} isSelected={isSelected} />;
      case 'image':
        return <ImageBlockRenderer block={block} onUpdate={onUpdate} isSelected={isSelected} />;
      case 'video':
        return <VideoBlockRenderer block={block} onUpdate={onUpdate} isSelected={isSelected} />;
      case 'embed':
        return <EmbedBlockRenderer block={block} onUpdate={onUpdate} isSelected={isSelected} />;
      case 'quote':
        return <QuoteBlockRenderer block={block} onUpdate={onUpdate} isSelected={isSelected} />;
      case 'list':
        return <ListBlockRenderer block={block} onUpdate={onUpdate} isSelected={isSelected} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {renderBlock()}
    </div>
  );
}

function TextBlockRenderer({ block, onUpdate, isSelected }: { 
  block: AnyBlock; 
  onUpdate: (content: any) => void; 
  isSelected: boolean; 
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
    ],
    content: (block.content as any).html || (block.content as any).text || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const text = editor.getText();
      onUpdate({ html, text });
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[60px] w-full',
      },
    },
  });

  if (!block.content?.text && !block.content?.html && !isSelected) {
    return (
      <div className="text-muted-foreground italic py-4 text-center border-2 border-dashed rounded-lg">
        Click to add text content...
      </div>
    );
  }

  return (
    <div className={cn("w-full", isSelected && "ring-2 ring-primary/20 rounded-lg p-2")}>
      <EditorContent editor={editor} />
    </div>
  );
}

function HeadingBlockRenderer({ block, onUpdate, isSelected }: { 
  block: AnyBlock; 
  onUpdate: (content: any) => void; 
  isSelected: boolean; 
}) {
  const content = block.content as any;
  
  const handleTextChange = (text: string) => {
    onUpdate({ ...content, text });
  };

  const handleLevelChange = (level: string) => {
    onUpdate({ ...content, level: parseInt(level) });
  };

  const HeadingTag = `h${content.level || 1}` as keyof JSX.IntrinsicElements;

  return (
    <div className="space-y-2">
      {isSelected && (
        <div className="flex items-center gap-2 mb-2">
          <Label className="text-xs">Level:</Label>
          <Select value={String(content.level || 1)} onValueChange={handleLevelChange}>
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map(level => (
                <SelectItem key={level} value={String(level)}>H{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <HeadingTag className={cn(
        "font-bold leading-tight focus:outline-none",
        content.level === 1 && "text-4xl",
        content.level === 2 && "text-3xl",
        content.level === 3 && "text-2xl",
        content.level === 4 && "text-xl",
        content.level === 5 && "text-lg",
        content.level === 6 && "text-base",
      )}>
        {isSelected ? (
          <Input
            value={content.text || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Enter heading text..."
            className="border-none p-0 text-inherit font-inherit bg-transparent focus-visible:ring-0"
          />
        ) : (
          content.text || 'Click to add heading...'
        )}
      </HeadingTag>
    </div>
  );
}

function ImageBlockRenderer({ block, onUpdate, isSelected }: { 
  block: AnyBlock; 
  onUpdate: (content: any) => void; 
  isSelected: boolean; 
}) {
  const content = block.content as any;
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, upload to your storage service
      const reader = new FileReader();
      reader.onload = (e) => {
        onUpdate({
          ...content,
          url: e.target?.result as string,
          alt: file.name,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    onUpdate({ ...content, url });
  };

  const handleAltChange = (alt: string) => {
    onUpdate({ ...content, alt });
  };

  const handleCaptionChange = (caption: string) => {
    onUpdate({ ...content, caption });
  };

  if (!content.url) {
    return (
      <div className="space-y-4">
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <div className="space-y-2">
            <Input
              placeholder="Image URL"
              value={content.url || ''}
              onChange={(e) => handleUrlChange(e.target.value)}
            />
            <Label htmlFor="image-upload" className="cursor-pointer">
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </Label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative group">
        <img
          src={content.url}
          alt={content.alt || ''}
          className="w-full rounded-lg shadow-sm"
        />
        {isSelected && (
          <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onUpdate({ ...content, url: '' })}
            >
              Change Image
            </Button>
          </div>
        )}
      </div>
      
      {isSelected && (
        <div className="space-y-2">
          <Input
            placeholder="Alt text"
            value={content.alt || ''}
            onChange={(e) => handleAltChange(e.target.value)}
          />
          <Input
            placeholder="Caption (optional)"
            value={content.caption || ''}
            onChange={(e) => handleCaptionChange(e.target.value)}
          />
        </div>
      )}
      
      {content.caption && (
        <p className="text-sm text-muted-foreground text-center italic">
          {content.caption}
        </p>
      )}
    </div>
  );
}

function VideoBlockRenderer({ block, onUpdate, isSelected }: { 
  block: AnyBlock; 
  onUpdate: (content: any) => void; 
  isSelected: boolean; 
}) {
  const content = block.content as any;

  const handleUrlChange = (url: string) => {
    onUpdate({ ...content, url });
  };

  const handleTitleChange = (title: string) => {
    onUpdate({ ...content, title });
  };

  const getVideoProvider = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo.com')) return 'vimeo';
    return 'upload';
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url;
  };

  if (!content.url) {
    return (
      <div className="space-y-4">
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <Play className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <Input
            placeholder="Video URL (YouTube, Vimeo, or direct link)"
            value={content.url || ''}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
        </div>
      </div>
    );
  }

  const provider = getVideoProvider(content.url);
  const embedUrl = getEmbedUrl(content.url);

  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
        {provider === 'upload' ? (
          <video controls className="w-full h-full">
            <source src={embedUrl} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allowFullScreen
            frameBorder="0"
          />
        )}
      </div>

      {isSelected && (
        <div className="space-y-2">
          <Input
            placeholder="Video URL"
            value={content.url}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
          <Input
            placeholder="Title (optional)"
            value={content.title || ''}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
        </div>
      )}

      {content.title && (
        <h3 className="font-medium text-center">{content.title}</h3>
      )}

      <div className="flex justify-center">
        <Badge variant="secondary">{provider}</Badge>
      </div>
    </div>
  );
}

function EmbedBlockRenderer({ block, onUpdate, isSelected }: { 
  block: AnyBlock; 
  onUpdate: (content: any) => void; 
  isSelected: boolean; 
}) {
  const content = block.content as any;

  const handleUrlChange = (url: string) => {
    onUpdate({ ...content, url });
  };

  if (!content.url) {
    return (
      <div className="space-y-4">
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <Link2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <Input
            placeholder="Embed URL (Twitter, Instagram, etc.)"
            value={content.url || ''}
            onChange={(e) => handleUrlChange(e.target.value)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="text-center">
          <Link2 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Embedded content</p>
          <p className="text-xs font-mono mt-1 break-all">{content.url}</p>
        </div>
      </Card>

      {isSelected && (
        <Input
          placeholder="Embed URL"
          value={content.url}
          onChange={(e) => handleUrlChange(e.target.value)}
        />
      )}
    </div>
  );
}

function QuoteBlockRenderer({ block, onUpdate, isSelected }: { 
  block: AnyBlock; 
  onUpdate: (content: any) => void; 
  isSelected: boolean; 
}) {
  const content = block.content as any;

  const handleTextChange = (text: string) => {
    onUpdate({ ...content, text });
  };

  const handleAuthorChange = (author: string) => {
    onUpdate({ ...content, author });
  };

  return (
    <div className="space-y-4">
      <blockquote className="border-l-4 border-primary pl-6 italic">
        {isSelected ? (
          <Textarea
            value={content.text || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Enter quote text..."
            className="border-none p-0 text-inherit bg-transparent focus-visible:ring-0 resize-none"
            rows={3}
          />
        ) : (
          <p className="text-lg">{content.text || 'Click to add quote...'}</p>
        )}
      </blockquote>

      {(isSelected || content.author) && (
        <div className="text-right">
          {isSelected ? (
            <Input
              value={content.author || ''}
              onChange={(e) => handleAuthorChange(e.target.value)}
              placeholder="Author (optional)"
              className="text-right"
            />
          ) : (
            content.author && <cite className="text-muted-foreground">— {content.author}</cite>
          )}
        </div>
      )}
    </div>
  );
}

function ListBlockRenderer({ block, onUpdate, isSelected }: { 
  block: AnyBlock; 
  onUpdate: (content: any) => void; 
  isSelected: boolean; 
}) {
  const content = block.content as any;

  const handleItemChange = (index: number, text: string) => {
    const newItems = [...(content.items || [''])];
    newItems[index] = text;
    onUpdate({ ...content, items: newItems });
  };

  const addItem = () => {
    const newItems = [...(content.items || ['']), ''];
    onUpdate({ ...content, items: newItems });
  };

  const removeItem = (index: number) => {
    const newItems = content.items.filter((_: any, i: number) => i !== index);
    onUpdate({ ...content, items: newItems.length > 0 ? newItems : [''] });
  };

  const toggleOrdered = () => {
    onUpdate({ ...content, ordered: !content.ordered });
  };

  const ListTag = content.ordered ? 'ol' : 'ul';

  return (
    <div className="space-y-4">
      {isSelected && (
        <div className="flex items-center gap-2">
          <Button
            variant={content.ordered ? "default" : "outline"}
            size="sm"
            onClick={toggleOrdered}
          >
            {content.ordered ? 'Numbered' : 'Bulleted'}
          </Button>
          <Button variant="outline" size="sm" onClick={addItem}>
            Add Item
          </Button>
        </div>
      )}

      <ListTag className={cn(
        "space-y-2",
        content.ordered ? "list-decimal list-inside" : "list-disc list-inside"
      )}>
        {(content.items || ['']).map((item: string, index: number) => (
          <li key={index} className="flex items-center gap-2">
            {isSelected ? (
              <div className="flex-1 flex items-center gap-2">
                <Input
                  value={item}
                  onChange={(e) => handleItemChange(index, e.target.value)}
                  placeholder="List item..."
                  className="flex-1"
                />
                {content.items.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    ×
                  </Button>
                )}
              </div>
            ) : (
              <span>{item || 'Empty list item'}</span>
            )}
          </li>
        ))}
      </ListTag>
    </div>
  );
}