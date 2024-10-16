import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Buffer } from 'buffer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DialService {
  constructor(
    private readonly httpService: HttpService,
    private readonly config: ConfigService,
  ) {}

  async predictImages(prompt: string): Promise<any> {
    try {
      const dialUrl = this.config.get('DIAL_URL');
      const apiKey = this.config.get('DIAL_API_KEY');
      const { data } = await firstValueFrom<{ data: any }>(
        this.httpService.post(
          `${dialUrl}/openai/deployments/dall-e-3/chat/completions?api-version=2023-12-01-preview`,
          {
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.5,
          },
          {
            headers: {
              'API-KEY': apiKey,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      const imageUrl = data.choices[0].message.custom_content.attachments[1].url;
      const result = await this.downloadFileAsBase64(dialUrl, imageUrl, { 'API-KEY': apiKey });

      return result;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
  async downloadFileAsBase64(dialUrl, fileUrl, dialHeaders) {
    if (this.isRelativeUrl(fileUrl)) {
      fileUrl = `${dialUrl}/v1/${fileUrl}`;
    }

    const headers = fileUrl.startsWith(dialUrl) ? dialHeaders : {};
    const response = await firstValueFrom<{ data: any }>(this.httpService.get(fileUrl, { headers, responseType: 'arraybuffer' }));

    const data = response.data;

    const base64String = Buffer.from(data, 'binary').toString('base64');
    return base64String;
  }
  isRelativeUrl(url) {
    return !/^https?:\/\//i.test(url);
  }
}
