import { ApiProperty } from '@nestjs/swagger';
import { IWeather } from '../../../integrations/open-weather-map';

export class WeatherDto implements IWeather {
  @ApiProperty({
    description: 'Description of the weather',
    type: 'string',
    nullable: false,
    example: 'Clear sky',
  })
  readonly description: string;

  @ApiProperty({
    description: 'Temperature in Celsius',
    type: 'number',
    nullable: false,
    example: 25,
  })
  readonly temperature: number;

  @ApiProperty({
    description: 'Emoji representation of the weather',
    type: 'string',
    nullable: false,
    example: '🌞',
  })
  readonly emojis: string;
}
