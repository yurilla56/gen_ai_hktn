import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Buffer } from 'buffer';

@Injectable()
export class DialService {
  constructor(private readonly httpService: HttpService) {}

  async predictImages(prompt: string): Promise<any> {
    try {
      const dialUrl = 'https://ai-proxy.lab.epam.com';
      const { data } = await firstValueFrom<{ data: any }>(
        this.httpService.post(
          `${dialUrl}/openai/deployments/dall-e-3/chat/completions?api-version=2023-12-01-preview`,
          {
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.5,
          },
          {
            headers: {
              'API-KEY': 'a91936406df144ef90ddc5c155310024',
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const imageUrl = data.choices[0].message.custom_content.attachments[1].url;
      const result = await this.downloadFileAsBase64(dialUrl, imageUrl, { 'API-KEY': 'a91936406df144ef90ddc5c155310024' });

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
    const response = await firstValueFrom<{ data: any }>(this.httpService.get(fileUrl, { headers }));

    const data = response.data;

    return Buffer.from(data).toString('base64');
  }
  isRelativeUrl(url) {
    return !/^https?:\/\//i.test(url);
  }
}
