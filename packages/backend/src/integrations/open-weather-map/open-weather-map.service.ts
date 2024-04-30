import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IOpenWeatherMapResponse, IWeather } from './types';

/**
 * Service to interact with the OpenWeatherMap API
 * Documentation: https://home.openweathermap.org
 */
@Injectable()
export class OpenWeatherMapService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  async getWeather(lat: number, lon: number): Promise<IWeather> {
    const apiKey = this.config.get<string>('OPENWEATHER_API_KEY');
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const { data } = await firstValueFrom<{ data: IOpenWeatherMapResponse }>(this.httpService.get(url));

    const description = `The weather in ${data.name} is ${data.weather[0].description} with a temperature of ${data.main.temp}°C and humidity of ${data.main.humidity}%`;

    return {
      description,
      temperature: data.main.temp,
      emojis: this.convertWeatherToEmoji(data),
    };
  }

  private convertWeatherToEmoji(data: IOpenWeatherMapResponse): string {
    const emojis: string[] = [];

    if (data.main.temp < 0) {
      emojis.push('❄️'); // Freezing
    } else if (data.main.temp > 20 && data.main.temp < 30) {
      emojis.push('☀️');
    } else if (data.main.temp > 30) {
      emojis.push('🔥');
    }

    // Wind emojis
    if (data.wind.speed > 10) {
      emojis.push('🌬️'); // Windy
    }

    // Humidity emojis
    if (data.main.humidity > 50 && data.main.humidity < 80) {
      emojis.push('☔');
    } else if (data.main.humidity > 80) {
      emojis.push('☔');
    }

    // Pressure emojis
    if (data.main.pressure > 1020) {
      emojis.push('🌪️'); // High pressure
    }

    return emojis.join(' ');
  }
}
