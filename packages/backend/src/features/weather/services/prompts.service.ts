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

  getClothIsPresentInImagePrompt(cloth: string): string {
    return `
      - Verify if provided cloth is present in the image: ${cloth}
      - You MUST not use any markup language in your response.
      - Analogues of the cloth are also considered as a match.
      - Your response should be either 'YES' or 'NO'.
    `;
  }

  getClothesByWeatherPrompt(weather: string): string {
    return `
      - Generate clothes suitable for provided weather: ${weather}
      - You MUST not use any markup language in your response.
      - Use abstract names for clothes, e.g. 'jacket', 't-shirt', 'shorts', 'sunhat'.
      - You MUST not include any optional information.
      - Your response MUST be a list of clothes separated by new line.
    `;
  }
}
