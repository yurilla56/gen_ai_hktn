import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { emptyStringErrorMessage, stringTypeErrorMessage } from 'src/common/errors';

export class PromptBodyDto {
  @ApiProperty({
    description: 'prompt',
    type: 'string',
    nullable: false,
  })
  @IsString({ message: stringTypeErrorMessage('prompt') })
  @MinLength(0, { message: emptyStringErrorMessage('prompt') })
  readonly prompt: string;
}
