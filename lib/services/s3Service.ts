import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

export interface S3UploadResult {
  key: string;
  url: string;
  size: number;
  format: string;
}

export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET_NAME!;
    this.region = process.env.AWS_REGION!;
    
    if (!this.bucketName || !this.region) {
      throw new Error('AWS S3 configuration missing. Please check environment variables.');
    }

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  /**
   * Upload a media file to S3
   * @param buffer - File buffer
   * @param fileName - Original file name
   * @param mimeType - MIME type
   * @param userId - User ID for organizing files
   * @param postId - Optional post ID for organizing files
   * @returns Upload result with key and URL
   */
  public async uploadMediaFile(
    buffer: Buffer,
    fileName: string,
    mimeType: string,
    userId: string,
    postId?: string
  ): Promise<S3UploadResult> {
    try {
      // Generate unique key for the file
      const fileExtension = this.getFileExtension(fileName);
      const key = postId 
        ? `MediaSuite/posts/${userId}/${postId}/${uuidv4()}.${fileExtension}`
        : `MediaSuite/media/${userId}/${uuidv4()}.${fileExtension}`;

      // Upload to S3
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        Metadata: {
          'original-filename': fileName,
          'uploaded-by': userId,
          'uploaded-at': new Date().toISOString(),
          ...(postId && { 'post-id': postId }),
        },
      });

      await this.s3Client.send(uploadCommand);

      // Generate URL
      const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;

      return {
        key,
        url,
        size: buffer.length,
        format: fileExtension,
      };
    } catch (error) {
      throw new Error(`S3 upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a media file from S3
   * @param url - S3 URL of the file to delete
   * @returns Success status
   */
  public async deleteMedia(url: string): Promise<boolean> {
    try {
      const key = this.extractKeyFromUrl(url);
      if (!key) {
        console.error('Invalid S3 URL:', url);
        return false;
      }

      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(deleteCommand);
      return true;
    } catch (error) {
      console.error('S3 delete failed:', error);
      return false;
    }
  }

  /**
   * Upload an image to S3
   * @param buffer - Image buffer
   * @param fileName - Original file name
   * @param userId - User ID for organizing files
   * @param format - Image format
   * @returns Upload result with key and URL
   */
  public async uploadProfilePicture(
    buffer: Buffer,
    fileName: string,
    userId: string,
    format: string = 'webp'
  ): Promise<S3UploadResult> {
    try {
      // Generate unique key for the file
      const fileExtension = format.toLowerCase();
      const key = `MediaSuite/profile-pictures/${userId}/${uuidv4()}.${fileExtension}`;

      // Upload to S3
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: `image/${fileExtension}`,
        Metadata: {
          'original-filename': fileName,
          'uploaded-by': userId,
          'uploaded-at': new Date().toISOString(),
        },
      });

      await this.s3Client.send(uploadCommand);

      // Generate private URL
      const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;

      return {
        key,
        url,
        size: buffer.length,
        format: fileExtension,
      };
    } catch (error) {
      throw new Error(`S3 upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete an image from S3
   * @param key - S3 object key
   * @returns Success status
   */
  public async deleteProfilePicture(key: string): Promise<boolean> {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(deleteCommand);
      return true;
    } catch (error) {
      console.error('S3 delete failed:', error);
      return false;
    }
  }

  /**
   * Generate a presigned URL for temporary access
   * @param key - S3 object key
   * @param expiresIn - Expiration time in seconds (default: 3600)
   * @returns Presigned URL
   */
  private async generatePresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      throw new Error(`Failed to generate presigned URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract S3 key from URL
   * @param url - S3 URL
   * @returns S3 key
   */
  public extractKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts.slice(1).join('/'); // Remove leading slash
    } catch {
      return null;
    }
  }

  /**
   * Check if a URL is from our S3 bucket
   * @param url - URL to check
   * @returns True if it's from our S3 bucket
   */
  public isS3Url(url: string): boolean {
    return url.includes(`${this.bucketName}.s3.${this.region}.amazonaws.com`);
  }

  /**
   * Get file extension from filename
   * @param filename - File name
   * @returns File extension
   */
  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || 'bin';
  }
}

export const s3Service = new S3Service();