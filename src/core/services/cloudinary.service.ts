import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.getOrThrow('CLOUDINARY_API_KEY'),
      api_secret: this.configService.getOrThrow('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'city-images',
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Upload failed: no result returned'));
          }
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error);
      throw error;
    }
  }

  // Helper method to extract public_id from Cloudinary URL
  extractPublicId(url: string): string {
    try {
      const parts = url.split('/');
      const uploadIndex = parts.indexOf('upload');
      if (uploadIndex === -1) return '';

      // Get everything after 'upload' and version (if present)
      const pathParts = parts.slice(uploadIndex + 1);

      // Remove version if present (starts with 'v' followed by numbers)
      const startIndex = pathParts[0].startsWith('v') ? 1 : 0;

      // Join the remaining parts and remove file extension
      const publicIdWithExt = pathParts.slice(startIndex).join('/');
      return publicIdWithExt.replace(/\.[^.]+$/, '');
    } catch (error) {
      console.error('Error extracting public_id:', error);
      return '';
    }
  }
}
