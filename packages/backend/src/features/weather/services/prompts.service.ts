import { Injectable } from '@nestjs/common';

@Injectable()
export class PromptsService {
  getWeatherRecommendationPrompt(weather: string): string {
    return `
      - Generate recommendation for provided weather: ${weather}
      - You MUST not use any markup language in your response.
      - Your response should be an ordinary text.
    `;
  }

  getSuitableClothesForWeatherImagePrompt(weather: string): string {
    return `
      - Generate an image of person in suitable clothes by weather: ${weather}
      - You MUST not use any markup language in your response.
      - Your response should be an ordinary text.
    `;
  }

  getVerifyClothesIsSuitableForWeatherPrompt(recommendation: string): string {
    return `
      - Verify that clothes is suitable for provided weather recommendations: ${recommendation}
      - You MUST not use any markup language in your response.
      - Your response should be an ordinary text.
      - Your response should be either 'PASS' or 'FAIL'.
    `;
  }

  getClothesByWeatherPrompt(weather: string): string {
    return `
      - Generate clothes suitable for provided weather: ${weather}
      - You MUST not use any markup language in your response.
      - Your response MUST be a list of clothes separated by new line.
    `;
  }
}
