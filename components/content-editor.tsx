"use client";
import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import { Extension } from "@tiptap/core";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Code,
  Palette,
  Type,
  Highlighter,
  ChevronDown,
  Hash,
} from "lucide-react";

// Import proper types
import type { Editor } from "@tiptap/react";

// Extend the Commands interface to include our custom commands
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

// Custom FontSize extension
const FontSize = Extension.create({
  name: "fontSize",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element: HTMLElement) =>
              element.style.fontSize.replace(/['"]+/g, ""),
            renderHTML: (attributes: { fontSize?: string }) => {
              if (!attributes.fontSize) {
                return {};
              }
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

interface ContentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  selectedPlatforms: number[];
}

export function ContentEditor({
  content,
  onContentChange,
  selectedPlatforms,
}: ContentEditorProps) {
  const [htmlContent, setHtmlContent] = useState(content);

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: "focus:outline-none",
      },
    },
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      FontFamily,
      FontSize,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: htmlContent,
    onUpdate: ({ editor }: { editor: Editor }) => {
      const html = editor.getHTML();
      setHtmlContent(html);
      onContentChange(html);
    },
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== htmlContent) {
      editor.commands.setContent(content);
      setHtmlContent(content);
    }
  }, [content, editor, htmlContent]);

  if (!editor) {
    return null;
  }

  const colors = [
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#ef4444" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#22c55e" },
    { name: "Purple", value: "#a855f7" },
    { name: "Orange", value: "#f97316" },
    { name: "Pink", value: "#ec4899" },
    { name: "Gray", value: "#6b7280" },
  ];

  const fonts = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Verdana",
    "Courier New",
    "Comic Sans MS",
    "Impact",
    "Trebuchet MS",
    "Palatino",
  ];

  const fontSizes = [
    { name: "Extra Small", value: "12px" },
    { name: "Small", value: "14px" },
    { name: "Normal", value: "16px" },
    { name: "Medium", value: "18px" },
    { name: "Large", value: "20px" },
    { name: "Extra Large", value: "24px" },
    { name: "Huge", value: "32px" },
  ];

  const highlightColors = [
    { name: "Yellow", value: "#fef08a" },
    { name: "Green", value: "#bbf7d0" },
    { name: "Blue", value: "#bfdbfe" },
    { name: "Pink", value: "#f9a8d4" },
    { name: "Purple", value: "#d8b4fe" },
    { name: "Orange", value: "#fed7aa" },
  ];

  const changeColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const changeFont = (font: string) => {
    editor.chain().focus().setFontFamily(font).run();
  };

  const changeFontSize = (size: string) => {
    // Now we can use the properly typed custom command
    editor.chain().focus().setFontSize(size).run();
  };

  const changeHighlight = (color: string) => {
    editor.chain().focus().setHighlight({ color }).run();
  };

  const getCharacterLimits = () => {
    const textContent = editor.getText();
    const limits = [];
    if (selectedPlatforms.includes(1)) {
      limits.push({
        name: "Twitter",
        limit: 280,
        remaining: 280 - textContent.length,
      });
    }
    if (selectedPlatforms.includes(2)) {
      limits.push({
        name: "LinkedIn",
        limit: 3000,
        remaining: 3000 - textContent.length,
      });
    }
    if (selectedPlatforms.includes(3)) {
      limits.push({
        name: "Instagram",
        limit: 2200,
        remaining: 2200 - textContent.length,
      });
    }
    if (selectedPlatforms.includes(4)) {
      limits.push({
        name: "YouTube",
        limit: 5000,
        remaining: 5000 - textContent.length,
      });
    }
    if (selectedPlatforms.includes(5)) {
      limits.push({
        name: "TikTok",
        limit: 2200,
        remaining: 2200 - textContent.length,
      });
    }
    if (selectedPlatforms.includes(6)) {
      limits.push({
        name: "Personal",
        limit: null,
        remaining: null,
      });
    }
    return limits;
  };

  return (
    <div>
      <label className="text-sm font-medium">Content Editor</label>
      {/* Formatting Toolbar */}
      <div className="mt-2 border rounded-lg">
        <div className="flex items-center gap-1 p-2 border-b bg-gray-50/50">
          {/* Text Formatting */}
          <div className="flex items-center gap-1">
            <Button
              variant={editor.isActive("bold") ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => editor.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive("italic") ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive("underline") ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            >
              <UnderlineIcon className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={editor.isActive("highlight") ? "default" : "ghost"}
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Highlighter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {highlightColors.map((color) => (
                  <DropdownMenuItem
                    key={color.value}
                    onClick={() => changeHighlight(color.value)}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: color.value }}
                    />
                    {color.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().unsetHighlight().run()}
                >
                  Remove Highlight
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Separator orientation="vertical" className="h-6" />
          {/* Alignment */}
          <div className="flex items-center gap-1">
            <Button
              variant={
                editor.isActive({ textAlign: "left" }) ? "default" : "ghost"
              }
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
              variant={
                editor.isActive({ textAlign: "center" }) ? "default" : "ghost"
              }
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
              variant={
                editor.isActive({ textAlign: "right" }) ? "default" : "ghost"
              }
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-6" />
          {/* Lists */}
          <div className="flex items-center gap-1">
            <Button
              variant={editor.isActive("bulletList") ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive("orderedList") ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-6" />
          {/* Special Elements */}
          <div className="flex items-center gap-1">
            <Button
              variant={editor.isActive("blockquote") ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
              <Quote className="h-4 w-4" />
            </Button>
            <Button
              variant={editor.isActive("code") ? "default" : "ghost"}
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => editor.chain().focus().toggleCode().run()}
            >
              <Code className="h-4 w-4" />
            </Button>
          </div>
          <Separator orientation="vertical" className="h-6" />
          {/* Style Tools */}
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Palette className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {colors.map((color) => (
                  <DropdownMenuItem
                    key={color.value}
                    onClick={() => changeColor(color.value)}
                    className="flex items-center gap-2"
                  >
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: color.value }}
                    />
                    {color.name}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().unsetColor().run()}
                >
                  Reset Color
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Type className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {fonts.map((font) => (
                  <DropdownMenuItem
                    key={font}
                    onClick={() => changeFont(font)}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().unsetFontFamily().run()}
                >
                  Reset Font
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Hash className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {fontSizes.map((size) => (
                  <DropdownMenuItem
                    key={size.value}
                    onClick={() => changeFontSize(size.value)}
                    className="flex items-center gap-2"
                    style={{ fontSize: size.value }}
                  >
                    {size.name} ({size.value})
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem
                  onClick={() => editor.chain().focus().unsetFontSize().run()}
                >
                  Reset Font Size
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* Content Area */}
        <div className="min-h-[120px]">
          <EditorContent
            editor={editor}
            className="prose max-w-none focus:ring-0 focus:outline-none min-h-[120px]"
          />
        </div>
      </div>
      {/* Character Counter */}
      <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
        <span>Characters: {editor.getText().length}</span>
        <div className="flex gap-4">
          {getCharacterLimits().map((platform) => (
            <span
              key={platform.name}
              className={
                platform.remaining === null
                  ? "text-gray-500"
                  : platform.remaining < 0
                  ? "text-red-500 font-medium"
                  : platform.remaining < platform.limit! * 0.1
                  ? "text-orange-500"
                  : "text-gray-500"
              }
            >
              {platform.name}:{" "}
              {platform.remaining === null ? "No limit" : platform.remaining}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
