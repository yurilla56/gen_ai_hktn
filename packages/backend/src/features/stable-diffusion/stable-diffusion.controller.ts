import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { StableDiffusionService } from '../..//integrations/stable-diffusion/stable-diffusion.service';
import { PromptBodyDto } from './dtos/prompt';

@ApiTags('Stable Diffusion')
@ApiSecurity('x-api-key')
@UseGuards(ApiKeyGuard)
@Controller('stable-diffusion')
export class StableDiffusionController {
  constructor(private readonly stableDiffusionService: StableDiffusionService) {}

  @ApiResponse({
    status: 200,
    description: 'OK',
    type: [String],
  })
  @Post('predict')
  async predictImages(@Body() prompt: PromptBodyDto): Promise<string> {
    const base64Images = await this.stableDiffusionService.predictImages(prompt.prompt);
    return base64Images;
  }
}
