import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { emptyStringErrorMessage, stringTypeErrorMessage } from '../../../common/errors';

export class VerifyClothesDto {
  @ApiProperty({
    description: 'Recommendation for suitable clothes',
    type: 'string',
    nullable: false,
    isArray: true,
    example: ['jacket', 't-shirt', 'shorts', 'sunhat'],
  })
  @IsString({ message: stringTypeErrorMessage('recommendation'), each: true })
  @MinLength(0, { message: emptyStringErrorMessage('recommendation'), each: true })
  readonly clothes: string[];

  @ApiProperty({
    description: 'Human image in the clothes for weather',
    type: 'string',
    nullable: false,
    example: 'iVBORw0KGgoAAAANSUhEUgAAABQAAABkCAYAAABw4pVUAAABhElEQVRIDbXBAQEAAAABIP6P7fp1CwQAAAAAAw',
  })
  @IsString({ message: stringTypeErrorMessage('image') })
  @MinLength(0, { message: emptyStringErrorMessage('image') })
  readonly image: string;
}
