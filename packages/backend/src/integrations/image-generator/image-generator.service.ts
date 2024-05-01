import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'node:fs/promises';
import { join } from 'path';

@Injectable()
export class ImageGeneratorService {
  constructor(private readonly config: ConfigService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async textToImageBase64(text: string): Promise<string> {
    if (this.config.get('IMAGE_GENERATOR_ENABLED') === 'true') {
      throw new Error('Image generator is not implemented yet');
    }

    const file = await fs.readFile(join(__dirname, '../../../assets/weather-dumb.jpg'));
    return file.toString('base64');
  }
}
