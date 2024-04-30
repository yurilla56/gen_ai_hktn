import { ApiProperty } from '@nestjs/swagger';

export class VerifyClothesResponseDto {
  @ApiProperty({
    type: 'object',
    additionalProperties: { type: 'boolean' },
    description: 'The clothes that are present in the image',
    example: {
      shirt: true,
      pants: false,
      hat: false,
    },
  })
  readonly clothes: Record<string, boolean>;
}
