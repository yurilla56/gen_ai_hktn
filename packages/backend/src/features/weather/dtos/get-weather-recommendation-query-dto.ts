import { IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { numberTypeErrorMessage, requiredErrorMessage } from '../../../common/errors';

export class GetWeatherRecommendationQueryDto {
  @ApiProperty({
    description: 'Latitude of the location',
    type: Number,
    nullable: false,
    example: 37.7749,
  })
  @IsNumber({}, { message: numberTypeErrorMessage('lat') })
  @IsNotEmpty({ message: requiredErrorMessage('lat') })
  readonly lat: number;

  @ApiProperty({
    description: 'Longitude of the location',
    type: Number,
    nullable: false,
    example: -122.4194,
  })
  @IsNumber({}, { message: numberTypeErrorMessage('lon') })
  @IsNotEmpty({ message: requiredErrorMessage('lon') })
  readonly lon: number;
}
