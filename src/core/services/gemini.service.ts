import { Injectable } from '@nestjs/common';
import { GoogleGenAI, Modality } from '@google/genai';
import { S3Service } from './s3.service';

@Injectable()
export class GeminiService {
  private readonly genAI: GoogleGenAI;

  constructor(private readonly s3Service: S3Service) {
    this.genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async generateImage(cityName: string, id: any): Promise<any> {
    const prompt = `Generate a high-quality, realistic image that visually represents the city of ${cityName}. Create a detailed cityscape showing iconic landmarks, architecture, and atmosphere typical of ${cityName}.`;

    try {
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.0-flash-preview-image-generation',
        contents: prompt,
        config: {
          responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
      });

      console.log('Generated image response:', response);

      const candidates = response?.candidates;
      if (!candidates || candidates.length === 0) {
        throw new Error('No candidates returned in Gemini response.');
      }

      const parts = candidates[0]?.content?.parts;
      if (!parts || parts.length === 0) {
        throw new Error('No parts found in Gemini response.');
      }

      for (const part of parts) {
        if (part.text) {
          console.log('Generated text:', part.text);
        } else if (part.inlineData?.data) {
          const imageData = part.inlineData.data;

          const buffer = Buffer.from(imageData, 'base64');

          const fileName = `${cityName.toLowerCase().replace(/\s/g, '-')}-${Date.now()}.png`;
          const file = {
            buffer: buffer,
            mimetype: 'image/png',
            originalname: fileName,
            fieldname: 'image',
            encoding: '7bit',
            size: buffer.length,
          } as Express.Multer.File;

          const fileKey = `city-images/${id}-${Date.now()}-${cityName.replace(/\s/g, '_')}.png`;
          const uploadResult = await this.s3Service.uploadFile(file, fileKey);

          console.log('Image uploaded to S3:', uploadResult);
          return uploadResult;
        }
      }

      return 'No image generated in response';
    } catch (error: any) {
      console.error('Error generating image:', error);
      throw new Error(
        `Failed to generate image for ${cityName}: ${error.message}`,
      );
    }
  }
}
