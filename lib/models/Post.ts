import mongoose, { Schema, Document } from 'mongoose';

// Define interfaces for TypeScript
export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  blocks: any[]; // Content blocks from editor
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledDate?: Date;
  publishedDate?: Date;
  platforms: string[];
  mediaFiles: {
    url: string;
    thumbnailUrl?: string;
    type: string;
    name: string;
    size: number;
    width?: number;
    height?: number;
    duration?: number;
    fileName?: string;
    fileType?: string;
  }[];
  publishAttempts: number;
  lastPublishAttempt?: Date;
  errorMessage?: string;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Post Schema
const PostSchema: Schema<IPost> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Post title is required'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    blocks: {
      type: [Schema.Types.Mixed] as any, // Flexible schema for content blocks
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'published', 'failed'],
      default: 'draft',
    },
    scheduledDate: {
      type: Date,
      index: true,
    },
    publishedDate: {
      type: Date,
    },
    platforms: [{
      type: String,
      enum: ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'tiktok'],
    }],
    mediaFiles: [{
      url: {
        type: String,
        required: true,
      },
      thumbnailUrl: {
        type: String,
      },
      type: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      size: {
        type: Number,
        required: true,
      },
      width: {
        type: Number,
      },
      height: {
        type: Number,
      },
      duration: {
        type: Number,
      },
      fileName: {
        type: String,
      },
      fileType: {
        type: String,
      },
    }],
    publishAttempts: {
      type: Number,
      default: 0,
    },
    lastPublishAttempt: {
      type: Date,
    },
    errorMessage: {
      type: String,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
PostSchema.index({ userId: 1, status: 1 });
PostSchema.index({ userId: 1, scheduledDate: 1 });
PostSchema.index({ status: 1, scheduledDate: 1 });

// Virtual for getting plain text content from blocks
PostSchema.virtual('contentText').get(function() {
  if (!this.blocks || this.blocks.length === 0) return '';
  
  return this.blocks
    .map((block: any) => {
      switch (block.type) {
        case 'text':
          return block.content?.text || '';
        case 'heading':
          return block.content?.text || '';
        case 'quote':
          return block.content?.text || '';
        case 'list':
          return block.content?.items?.join(', ') || '';
        default:
          return '';
      }
    })
    .join(' ')
    .trim();
});

// Ensure virtuals are included when converting to JSON
PostSchema.set('toJSON', { virtuals: true });

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post; 