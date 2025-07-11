import sharp from 'sharp';

export interface OptimizedImageResult {
  buffer: Buffer;
  format: string;
  width: number;
  height: number;
  size: number;
}

export class ImageOptimizationService {
  /**
   * Optimize an image for profile picture use
   * @param buffer - Original image buffer
   * @param format - Target format (webp, jpeg, png)
   * @returns Optimized image buffer and metadata
   */
  async optimizeProfilePicture(
    buffer: Buffer,
    format: 'webp' | 'jpeg' | 'png' = 'webp'
  ): Promise<OptimizedImageResult> {
    try {
      // Get original image metadata
      const metadata = await sharp(buffer).metadata();
      
      // Calculate target dimensions (square, max 512px)
      const maxSize = 512;
      const targetSize = Math.min(maxSize, Math.max(metadata.width || 0, metadata.height || 0));
      
      // Optimize the image
      let optimizedImage = sharp(buffer)
        .resize(targetSize, targetSize, {
          fit: 'cover',
          position: 'center'
        })
        .flatten({ background: { r: 255, g: 255, b: 255 } }); // Ensure white background

      // Apply format-specific optimizations
      switch (format) {
        case 'webp':
          optimizedImage = optimizedImage.webp({ 
            quality: 85,
            effort: 6,
            nearLossless: true
          });
          break;
        case 'jpeg':
          optimizedImage = optimizedImage.jpeg({ 
            quality: 85,
            progressive: true,
            mozjpeg: true
          });
          break;
        case 'png':
          optimizedImage = optimizedImage.png({ 
            compressionLevel: 9,
            progressive: true
          });
          break;
      }

      const optimizedBuffer = await optimizedImage.toBuffer();
      
      return {
        buffer: optimizedBuffer,
        format,
        width: targetSize,
        height: targetSize,
        size: optimizedBuffer.length
      };
    } catch (error) {
      throw new Error(`Image optimization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate a thumbnail version of an image
   * @param buffer - Original image buffer
   * @param size - Thumbnail size (default: 150px)
   * @returns Thumbnail buffer
   */
  async generateThumbnail(
    buffer: Buffer,
    size: number = 150
  ): Promise<Buffer> {
    try {
      return await sharp(buffer)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 80 })
        .toBuffer();
    } catch (error) {
      throw new Error(`Thumbnail generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate image file
   * @param buffer - Image buffer
   * @param maxSize - Maximum file size in bytes (default: 5MB)
   * @returns Validation result
   */
  async validateImage(
    buffer: Buffer,
    maxSize: number = 5 * 1024 * 1024
  ): Promise<{ isValid: boolean; error?: string; metadata?: sharp.Metadata }> {
    try {
      // Check file size
      if (buffer.length > maxSize) {
        return {
          isValid: false,
          error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit`
        };
      }

      // Validate image format
      const metadata = await sharp(buffer).metadata();
      
      if (!metadata.format || !['jpeg', 'jpg', 'png', 'gif', 'webp'].includes(metadata.format)) {
        return {
          isValid: false,
          error: 'Unsupported image format. Please use JPEG, PNG, GIF, or WebP.'
        };
      }

      // Check minimum dimensions
      if ((metadata.width || 0) < 50 || (metadata.height || 0) < 50) {
        return {
          isValid: false,
          error: 'Image dimensions are too small. Minimum size is 50x50 pixels.'
        };
      }

      return {
        isValid: true,
        metadata
      };
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid image file'
      };
    }
  }
}

export const imageOptimizationService = new ImageOptimizationService();