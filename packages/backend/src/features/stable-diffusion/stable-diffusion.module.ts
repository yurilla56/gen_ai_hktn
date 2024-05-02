import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StableDiffusionController } from './stable-diffusion.controller';
import { StableDiffusionService } from 'src/integrations/stable-diffusion/stable-diffusion.service';

@Module({
  imports: [HttpModule],
  controllers: [StableDiffusionController],
  providers: [StableDiffusionService],
})
export class StableDiffusionModule {}
