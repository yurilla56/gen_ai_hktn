import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import {
  emptyStringErrorMessage,
  stringTypeErrorMessage,
} from '../../../common/errors';

export class VerifyClothesDto {
  @ApiProperty({
    description: 'Recommendation for suitable clothes',
    type: 'string',
    nullable: false,
  })
  @IsString({ message: stringTypeErrorMessage('recommendation') })
  @MinLength(0, { message: emptyStringErrorMessage('recommendation') })
  readonly recommendation: string;

  @ApiProperty({
    description: 'Human image in the clothes for weather',
    type: 'string',
    nullable: false,
  })
  @IsString({ message: stringTypeErrorMessage('image') })
  @MinLength(0, { message: emptyStringErrorMessage('image') })
  readonly image: string;
}
