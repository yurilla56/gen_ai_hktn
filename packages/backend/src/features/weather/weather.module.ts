import { Module } from '@nestjs/common';
import { PromptsService } from './services/prompts.service';
import { WeatherController } from '../../features/weather/weather.controller';
import { WeatherService } from './weather.service';
import { GeminiService } from '../../integrations/gemini/gemini.service';
import { ImageGeneratorService } from '../../integrations/image-generator';
import { OpenWeatherMapService } from '../../integrations/open-weather-map';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [WeatherController],
  providers: [WeatherService, PromptsService, GeminiService, OpenWeatherMapService, ImageGeneratorService],
})
export class WeatherModule {}
