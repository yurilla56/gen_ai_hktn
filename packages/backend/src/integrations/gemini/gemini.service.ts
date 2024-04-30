import { GenerativeModel, GoogleGenerativeAI, InlineDataPart } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PromptsService } from '../../features/weather/services/prompts.service';

@Injectable()
export class GeminiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly geminiPro: GenerativeModel; // model for text prompts
  private readonly geminiProVision: GenerativeModel; // model for combining text and image prompts

  constructor(
    private readonly promptsService: PromptsService,
    readonly config: ConfigService,
  ) {
    this.genAI = new GoogleGenerativeAI(config.get('GEMINI_API_KEY'));
    this.geminiPro = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.geminiProVision = this.genAI.getGenerativeModel({
      model: 'gemini-pro-vision',
    });
  }

  async getResponseByTextPrompt(prompt: string): Promise<string> {
    const result = await this.geminiPro.generateContent(prompt);
    const response = await result.response;
    return response.text();
  }

  async getResponseByVisionPrompt(prompt: string, image: string): Promise<string> {
    const result = await this.geminiProVision.generateContent([prompt, this.convertBase64ImageToGeminiImage(image)]);
    const response = await result.response;
    return this.cleanText(response.text());
  }

  async getWeatherRecommendation(weather: string): Promise<string> {
    const prompt = this.promptsService.getWeatherRecommendationPrompt(weather);
    const recommendation = await this.getResponseByTextPrompt(prompt);
    return this.cleanText(recommendation);
  }

  private convertBase64ImageToGeminiImage(base64Image: string): InlineDataPart {
    return {
      inlineData: {
        data: base64Image,
        mimeType: 'image/png',
      },
    };
  }

  private cleanText(text: string): string {
    return text.replace(/(\r\n|\n|\r)/gm, '').replace(/\*/g, '');
  }

  private cleanList(text: string): string[] {
    return text.split('\n').map((item) => item.replace(/-/g, '').trim());
  }
}
