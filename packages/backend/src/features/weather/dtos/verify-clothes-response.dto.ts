import { ApiProperty } from '@nestjs/swagger';
import { Verification } from '../../../common/types';

export class VerifyClothesResponseDto {
  @ApiProperty({
    description: 'The result of clothes verification',
    type: 'enum',
    enum: Verification,
    nullable: false,
  })
  readonly result: Verification;

  @ApiProperty({
    description: 'Details of the failed verification result',
    type: 'string',
    nullable: true,
  })
  readonly details?: string;
}
