import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IOpenWeatherMapResponse } from './types';

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

  async getWeather(lat: number, lon: number): Promise<string> {
    const apiKey = this.config.get<string>('OPENWEATHER_API_KEY');
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const { data } = await firstValueFrom<{ data: IOpenWeatherMapResponse }>(
      this.httpService.get(url),
    );

    return `The weather in ${data.name} is ${data.weather[0].description} with a temperature of ${data.main.temp}°C and humidity of ${data.main.humidity}%`;
  }
}
