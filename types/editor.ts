export interface Block {
  id: string;
  type: 'text' | 'image' | 'video' | 'embed' | 'heading' | 'quote' | 'list';
  content: any;
  order: number;
}

export interface TextBlock extends Block {
  type: 'text';
  content: {
    text: string;
    html: string;
  };
}

export interface ImageBlock extends Block {
  type: 'image';
  content: {
    url: string;
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
  };
}

export interface VideoBlock extends Block {
  type: 'video';
  content: {
    url: string;
    thumbnail?: string;
    title?: string;
    provider?: 'youtube' | 'vimeo' | 'upload';
  };
}

export interface EmbedBlock extends Block {
  type: 'embed';
  content: {
    url: string;
    html?: string;
    provider?: string;
    title?: string;
  };
}

export interface HeadingBlock extends Block {
  type: 'heading';
  content: {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
  };
}

export interface QuoteBlock extends Block {
  type: 'quote';
  content: {
    text: string;
    author?: string;
  };
}

export interface ListBlock extends Block {
  type: 'list';
  content: {
    items: string[];
    ordered: boolean;
  };
}

export type AnyBlock = TextBlock | ImageBlock | VideoBlock | EmbedBlock | HeadingBlock | QuoteBlock | ListBlock;

export interface EditorState {
  blocks: AnyBlock[];
  selectedBlockId: string | null;
  isFullscreen: boolean;
}

export interface ActionButton {
  id: string;
  type: 'email_subscribe' | 'donation' | 'tip_jar' | 'custom';
  label: string;
  config: {
    service?: 'mailchimp' | 'buttondown' | 'convertkit';
    url?: string;
    amount?: number;
    currency?: string;
    style?: 'button' | 'widget';
  };
}