import { s3Service } from './s3Service';
import { imageOptimizationService } from './imageOptimizationService';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';
import { tmpdir } from 'os';
import { join } from 'path';
import { promises as fs } from 'fs';
import sharp from 'sharp';

export interface MediaFile {
  originalName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
  url?: string;
  thumbnailUrl?: string;
  duration?: number; // for video/audio
  width?: number; // for images/videos
  height?: number; // for images/videos
}

export interface UploadedMedia {
  url: string;
  thumbnailUrl?: string;
  type: string;
  name: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
}

class MediaUploadService {
  // Upload and process media file
  async uploadMedia(file: MediaFile, userId: string, postId?: string): Promise<UploadedMedia> {
    try {
      const fileExtension = this.getFileExtension(file.originalName);
      const fileName = this.generateFileName(file.originalName, userId, postId);
      
      let processedFile = file;
      let thumbnailUrl: string | undefined;

      // Process based on file type
      if (this.isImage(file.mimeType)) {
        processedFile = await this.processImage(file);
      } else if (this.isVideo(file.mimeType)) {
        const videoData = await this.processVideo(file);
        processedFile = videoData.file;
        thumbnailUrl = videoData.thumbnailUrl;
      } else if (this.isAudio(file.mimeType)) {
        processedFile = await this.processAudio(file);
      }

      // Upload to S3
      const uploadResult = await s3Service.uploadMediaFile(
        processedFile.buffer,
        fileName,
        processedFile.mimeType,
        userId,
        postId
      );

      return {
        url: uploadResult.url,
        thumbnailUrl,
        type: processedFile.mimeType,
        name: file.originalName,
        size: processedFile.size,
        width: processedFile.width,
        height: processedFile.height,
        duration: processedFile.duration,
      };
    } catch (error) {
      console.error('Error uploading media:', error);
      throw new Error('Failed to upload media file');
    }
  }

  // Process image files
  private async processImage(file: MediaFile): Promise<MediaFile> {
    try {
      // Validate image
      const validation = await imageOptimizationService.validateImage(file.buffer);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid image file');
      }

      // Optimize image for content (not profile picture)
      const optimizedImage = await this.optimizeContentImage(file.buffer);

      return {
        ...file,
        buffer: optimizedImage.buffer,
        size: optimizedImage.buffer.length,
        width: optimizedImage.width,
        height: optimizedImage.height,
        mimeType: 'image/webp',
      };
    } catch (error) {
      console.error('Error processing image:', error);
      throw error;
    }
  }

  // Optimize image for content (different from profile picture)
  private async optimizeContentImage(buffer: Buffer): Promise<{ buffer: Buffer; width: number; height: number }> {
    try {
      // Get original image metadata
      const metadata = await sharp(buffer).metadata();
      
      // Calculate target dimensions (max 1920x1080, maintain aspect ratio)
      const maxWidth = 1920;
      const maxHeight = 1080;
      
      let targetWidth = metadata.width || 0;
      let targetHeight = metadata.height || 0;
      
      if (targetWidth > maxWidth || targetHeight > maxHeight) {
        const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
        targetWidth = Math.round(targetWidth * ratio);
        targetHeight = Math.round(targetHeight * ratio);
      }
      
      // Optimize the image
      const optimizedBuffer = await sharp(buffer)
        .resize(targetWidth, targetHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ 
          quality: 85,
          effort: 6
        })
        .toBuffer();
      
      return {
        buffer: optimizedBuffer,
        width: targetWidth,
        height: targetHeight
      };
    } catch (error) {
      throw new Error(`Image optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Process video files
  private async processVideo(file: MediaFile): Promise<{ file: MediaFile; thumbnailUrl?: string }> {
    try {
      if (!this.isValidVideo(file.mimeType)) {
        throw new Error('Invalid video file format');
      }

      // Set ffmpeg path
      ffmpeg.setFfmpegPath(ffmpegPath!);

      // Write buffer to temp file
      const tempInputPath = join(tmpdir(), `input_${Date.now()}_${Math.random().toString(36).slice(2)}.mp4`);
      await fs.writeFile(tempInputPath, file.buffer);

      // Prepare output paths
      const tempOutputPath = join(tmpdir(), `output_${Date.now()}_${Math.random().toString(36).slice(2)}.mp4`);
      const tempThumbPath = join(tmpdir(), `thumb_${Date.now()}_${Math.random().toString(36).slice(2)}.webp`);

      // Transcode to MP4 and extract metadata
      const metadata = await this.getVideoMetadata(tempInputPath);
      await this.transcodeToMp4(tempInputPath, tempOutputPath);
      await this.generateVideoThumbnail(tempInputPath, tempThumbPath);

      // Read transcoded video and thumbnail
      const outputBuffer = await fs.readFile(tempOutputPath);
      const thumbBuffer = await fs.readFile(tempThumbPath);

      // Upload thumbnail to S3
      const thumbUpload = await s3Service.uploadMediaFile(
        thumbBuffer,
        `thumb_${file.originalName.replace(/\.[^/.]+$/, '')}.webp`,
        'image/webp',
        'system', // or userId if you want to track
      );

      // Clean up temp files
      await fs.unlink(tempInputPath).catch(() => {});
      await fs.unlink(tempOutputPath).catch(() => {});
      await fs.unlink(tempThumbPath).catch(() => {});

      return {
        file: {
          ...file,
          buffer: outputBuffer,
          size: outputBuffer.length,
          mimeType: 'video/mp4',
          width: metadata.width,
          height: metadata.height,
          duration: metadata.duration,
        },
        thumbnailUrl: thumbUpload.url,
      };
    } catch (error) {
      console.error('Error processing video:', error);
      throw error;
    }
  }

  // Utility: Get video metadata
  private getVideoMetadata(filePath: string): Promise<{ width?: number; height?: number; duration?: number }> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err: Error | null, metadata: any) => {
        if (err) return reject(err);
        const stream = metadata.streams.find((s: any) => s.width && s.height);
        resolve({
          width: stream?.width,
          height: stream?.height,
          duration: metadata.format.duration,
        });
      });
    });
  }

  // Utility: Transcode to MP4
  private transcodeToMp4(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions('-c:v libx264', '-preset veryfast', '-crf 23')
        .toFormat('mp4')
        .on('end', () => resolve())
        .on('error', reject)
        .save(outputPath);
    });
  }

  // Utility: Generate video thumbnail
  private generateVideoThumbnail(inputPath: string, thumbPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .on('end', () => resolve())
        .on('error', reject)
        .screenshots({
          count: 1,
          folder: tmpdir(),
          filename: thumbPath.split('/').pop(),
          size: '320x?',
        });
    });
  }

  // Process audio files
  private async processAudio(file: MediaFile): Promise<MediaFile> {
    try {
      // Validate audio file
      if (!this.isValidAudio(file.mimeType)) {
        throw new Error('Invalid audio file format');
      }

      // Set ffmpeg path
      ffmpeg.setFfmpegPath(ffmpegPath!);

      // Write buffer to temp file
      const tempInputPath = join(tmpdir(), `audio_${Date.now()}_${Math.random().toString(36).slice(2)}.mp3`);
      await fs.writeFile(tempInputPath, file.buffer);

      // Prepare output path
      const tempOutputPath = join(tmpdir(), `audio_output_${Date.now()}_${Math.random().toString(36).slice(2)}.mp3`);

      // Extract metadata and transcode if needed
      const metadata = await this.getAudioMetadata(tempInputPath);
      await this.transcodeAudio(tempInputPath, tempOutputPath);

      // Read transcoded audio
      const outputBuffer = await fs.readFile(tempOutputPath);

      // Clean up temp files
      await fs.unlink(tempInputPath).catch(() => {});
      await fs.unlink(tempOutputPath).catch(() => {});

      return {
        ...file,
        buffer: outputBuffer,
        size: outputBuffer.length,
        mimeType: 'audio/mpeg',
        duration: metadata.duration,
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      throw error;
    }
  }

  // Utility: Get audio metadata
  private getAudioMetadata(filePath: string): Promise<{ duration?: number }> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) return reject(err);
        resolve({
          duration: metadata.format.duration,
        });
      });
    });
  }

  // Utility: Transcode audio to MP3
  private transcodeAudio(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions('-c:a libmp3lame', '-b:a 128k')
        .toFormat('mp3')
        .on('end', () => resolve())
        .on('error', reject)
        .save(outputPath);
    });
  }

  // Generate unique filename
  private generateFileName(originalName: string, userId: string, postId?: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = this.getFileExtension(originalName);
    const baseName = originalName.replace(/\.[^/.]+$/, '');
    
    let fileName = `${userId}/${baseName}_${timestamp}_${randomId}.${extension}`;
    
    if (postId) {
      fileName = `${userId}/${postId}/${baseName}_${timestamp}_${randomId}.${extension}`;
    }
    
    return fileName;
  }

  // Get file extension
  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  // Check if file is image
  private isImage(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  // Check if file is video
  private isVideo(mimeType: string): boolean {
    return mimeType.startsWith('video/');
  }

  // Check if file is audio
  private isAudio(mimeType: string): boolean {
    return mimeType.startsWith('audio/');
  }

  // Validate video format
  private isValidVideo(mimeType: string): boolean {
    const allowedVideoTypes = [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime',
      'video/x-msvideo',
    ];
    return allowedVideoTypes.includes(mimeType);
  }

  // Validate audio format
  private isValidAudio(mimeType: string): boolean {
    const allowedAudioTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/ogg',
      'audio/webm',
      'audio/aac',
    ];
    return allowedAudioTypes.includes(mimeType);
  }

  // Delete media file from S3
  async deleteMedia(url: string): Promise<boolean> {
    try {
      return await s3Service.deleteMedia(url);
    } catch (error) {
      console.error('Error deleting media:', error);
      return false;
    }
  }

}

// Create singleton instance
const mediaUploadService = new MediaUploadService();

export default mediaUploadService; 