import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { DialService } from '../../integrations/dial/dial.service';
import { PromptBodyDto } from './dtos/prompt';

@ApiTags('Dial')
@ApiSecurity('x-api-key')
@UseGuards(ApiKeyGuard)
@Controller('dial')
export class DialController {
  constructor(private readonly dialService: DialService) {}

  @ApiResponse({
    status: 200,
    description: 'OK',
    type: [String],
  })
  @Post('predict')
  async predictImages(@Body() prompt: PromptBodyDto): Promise<{ data: string }> {
    const base64Image = await this.dialService.predictImages(prompt.prompt);
    return { data: base64Image };
  }
}
