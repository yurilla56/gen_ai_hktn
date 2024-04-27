import { Injectable } from '@nestjs/common';
import { GeminiService } from '../../integrations/gemini/gemini.service';
import { ImageGeneratorService } from '../../integrations/image-generator/image-generator.service';
import {
  ILocation,
  IVerificationResult,
  IVerifyClothes,
  IWeatherAndRecommendation,
} from '../../common/types';
import { OpenWeatherMapService } from 'src/integrations/open-weather-map';
import { PromptsService } from 'src/features/weather/services/prompts.service';

@Injectable()
export class WeatherService {
  constructor(
    private readonly imageGeneratorService: ImageGeneratorService,
    private readonly openWeatherMapService: OpenWeatherMapService,
    private readonly promptsService: PromptsService,
    private readonly geminiService: GeminiService,
  ) {}

  /**
   * Retrieves the weather image and recommendation based on the provided location coordinates
   */
  async getWeatherImageAndRecommendationByLocation({
    lat,
    lon,
  }: ILocation): Promise<IWeatherAndRecommendation> {
    const weather = await this.openWeatherMapService.getWeather(lat, lon);

    const recommendation =
      await this.geminiService.getWeatherRecommendation(weather);
    const clothes = await this.geminiService.getClothesByWeather(weather);

    const image = await this.generateWeatherImageBase64(weather);

    return { weather, recommendation, image, clothes };
  }

  /**
   * Verifies if the clothes are suitable for the weather based on the recommendation
   */
  async verifyClothesIsSuitableForWeather({
    recommendation,
    image,
  }: IVerifyClothes): Promise<IVerificationResult> {
    return await this.geminiService.verifyClothesIsSuitableForWeather(
      image,
      recommendation,
    );
  }

  private async generateWeatherImageBase64(weather: string): Promise<string> {
    const prompt =
      await this.promptsService.getSuitableClothesForWeatherImagePrompt(
        weather,
      );
    const image = await this.imageGeneratorService.textToImageBase64(prompt);
    return `data:image/png;base64,${image}`;
  }
}
