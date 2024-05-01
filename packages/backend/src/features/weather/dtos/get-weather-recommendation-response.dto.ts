import { ApiProperty } from '@nestjs/swagger';
import { IWeatherAndRecommendation } from '../../../common/types';
import { WeatherDto } from '../../../features/weather/dtos/weather-dto';

export class GetWeatherRecommendationResponseDto implements IWeatherAndRecommendation {
  @ApiProperty({
    description: 'Weather in the location',
    type: WeatherDto,
    nullable: false,
  })
  readonly weather: WeatherDto;

  @ApiProperty({
    description: 'Clothing recommendation for the provided weather in the location',
    type: 'string',
    nullable: false,
    isArray: true,
    example: ['jacket', 't-shirt', 'shorts', 'sunhat'],
  })
  readonly clothes: string[];

  @ApiProperty({
    description: 'Clothing recommendation for the provided weather in the location',
    type: 'string',
    nullable: false,
    example: 'It is recommended to wear a jacket, t-shirt, shorts, and a sunhat',
  })
  readonly recommendation: string;

  @ApiProperty({
    description: 'Weather image in base64 format',
    type: 'string',
    nullable: false,
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAABkCAYAAABw4pVUAAABhElEQVRIDbXBAQEAAAABIP6P7fp1CwQAAAAAAw',
  })
  readonly image: string;
}
