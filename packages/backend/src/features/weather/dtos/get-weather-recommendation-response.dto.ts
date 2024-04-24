import { ApiProperty } from '@nestjs/swagger';
import { IWeatherAndRecommendation } from '../../../common/types';

export class GetWeatherRecommendationResponseDto
  implements IWeatherAndRecommendation
{
  @ApiProperty({
    description: 'Weather in the location',
    type: 'string',
    nullable: false,
  })
  readonly weather: string;

  @ApiProperty({
    description:
      'Clothing recommendation for the provided weather in the location',
    type: 'string',
    nullable: false,
  })
  readonly clothes: string[];

  @ApiProperty({
    description:
      'Clothing recommendation for the provided weather in the location',
    type: 'string',
    nullable: false,
  })
  readonly recommendation: string;

  @ApiProperty({
    description: 'Weather image in base64 format',
    type: 'string',
    nullable: false,
  })
  readonly image: string;
}
