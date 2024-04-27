import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WeatherService } from 'src/features/weather/weather.service';
import { VerifyClothesDto } from './dtos/verify-clothes-body.dto';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { VerifyClothesResponseDto } from './dtos/verify-clothes-response.dto';
import { GetWeatherRecommendationResponseDto } from './dtos/get-weather-recommendation-response.dto';
import { GetWeatherRecommendationQueryDto } from 'src/features/weather/dtos/get-weather-recommendation-query-dto';

@ApiTags('Weather')
@ApiSecurity('x-api-key')
@UseGuards(ApiKeyGuard)
@Controller()
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @ApiResponse({
    status: 200,
    description: 'OK',
    type: GetWeatherRecommendationResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get('weather/recommendation')
  @HttpCode(200)
  async getWeatherImageAndRecommendationByLocation(
    @Query() query: GetWeatherRecommendationQueryDto,
  ): Promise<GetWeatherRecommendationResponseDto> {
    return await this.weatherService.getWeatherImageAndRecommendationByLocation(
      query,
    );
  }

  @ApiResponse({
    status: 200,
    description: 'OK',
    type: VerifyClothesResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('weather/verify')
  @HttpCode(200)
  async verifyPersonImageIsSuitableForWeather(
    @Body() dto: VerifyClothesDto,
  ): Promise<VerifyClothesResponseDto> {
    return await this.weatherService.verifyClothesIsSuitableForWeather(dto);
  }
}
