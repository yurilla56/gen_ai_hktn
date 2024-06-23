import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PredictionServiceClient } from '@google-cloud/aiplatform';
import { IValue } from 'google-protobuf/google/protobuf/struct_pb';

@Injectable()
export class StableDiffusionService {
  private readonly predictionServiceClient: PredictionServiceClient;

  constructor(private readonly config: ConfigService) {
    this.predictionServiceClient = new PredictionServiceClient({
      apiEndpoint: 'europe-west1-aiplatform.googleapis.com',
    });
  }

  async predictImages(prompt: string): Promise<string> {
    const instances: IValue[] = [
      {
        structValue: {
          fields: {
            height: { numberValue: 1024 },
            width: { numberValue: 1024 },
            num_inference_steps: { numberValue: 50 },
            guidance_scale: { numberValue: 7.5 },
            seed: { numberValue: 123 },
            prompt: { stringValue: prompt },
          },
        },
      },
    ];

    try {
      const response = await this.predictionServiceClient.predict({
        instances,
        endpoint: `projects/${this.config.get<string>('PROJECT')}/locations/${this.config.get<string>('LOCATION')}/endpoints/${this.config.get<string>('ENDPOINT_NAME')}`,
      });

      const base64Images: string[] = response[0].predictions.map((prediction) => prediction.stringValue);

      return base64Images[0];
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
