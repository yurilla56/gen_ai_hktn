import { Injectable } from '@nestjs/common';
import { GeminiService } from '../../integrations/gemini/gemini.service';
import { ImageGeneratorService } from '../../integrations/image-generator/image-generator.service';
import { ILocation, IVerifyClothes, IWeatherAndRecommendation } from '../../common/types';
import { OpenWeatherMapService } from '../../integrations/open-weather-map';
import { PromptsService } from '../../features/weather/services/prompts.service';
import { parseTextToList } from '../../common/utils';
import { VerifyClothesResponseDto } from 'src/features/weather/dtos/verify-clothes-response.dto';

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
  async getWeatherImageAndRecommendationByLocation({ lat, lon }: ILocation): Promise<IWeatherAndRecommendation> {
    const weather = await this.openWeatherMapService.getWeather(lat, lon);

    const clothes = await this.generateClothesByWeather(weather.description);
    const recommendation = await this.geminiService.getWeatherRecommendation(weather.description);
    const image = await this.generateWeatherImageBase64(weather.description);

    return { weather, recommendation, image, clothes };
  }

  /**
   * Verifies if the clothes are suitable for the weather based on the recommendation
   */
  async verifyClothesIsSuitableForWeather({ image, clothes }: IVerifyClothes): Promise<VerifyClothesResponseDto> {
    const result: Record<string, boolean> = {};

    for (const cloth of clothes) {
      result[cloth] = await this.verifyClothIsPresentInImage(cloth, image);
    }

    return { clothes: result };
  }

  private async verifyClothIsPresentInImage(cloth: string, image: string): Promise<boolean> {
    const prompt = this.promptsService.getClothIsPresentInImagePrompt(cloth);
    const response = await this.geminiService.getResponseByVisionPrompt(prompt, image);
    return response.includes('YES');
  }

  private async generateWeatherImageBase64(weather: string): Promise<string> {
    const prompt = await this.promptsService.getSuitableClothesForWeatherImagePrompt(weather);
    const image = await this.imageGeneratorService.textToImageBase64(prompt);
    return `data:image/png;base64,${image}`;
  }

  private async generateClothesByWeather(weather: string): Promise<string[]> {
    const prompt = await this.promptsService.getClothesByWeatherPrompt(weather);
    const response = await this.geminiService.getResponseByTextPrompt(prompt);
    return parseTextToList(response);
  }
}
