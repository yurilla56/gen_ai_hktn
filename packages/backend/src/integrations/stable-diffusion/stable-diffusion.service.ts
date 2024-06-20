import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PredictionServiceClient } from '@google-cloud/aiplatform';
import { IValue } from 'google-protobuf/google/protobuf/struct_pb';

@Injectable()
export class StableDiffusionService {
  private readonly predictionServiceClient: PredictionServiceClient;

  constructor(private readonly config: ConfigService) {
    this.predictionServiceClient = new PredictionServiceClient({
      apiEndpoint: this.config.get<string>('API_ENDPOINT'),
      credentials: {
        private_key:
          '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCd3YMB4iLREWUu\nHXb7bkTZaLuml1v7495kIwdO5NP3VC2RQJkFBtUFQXW07mtgR6+cD6M54ZjWdzR+\n7/9YLBqnq4UXPYyTmyTKgUDAS1wIt2Hvx+G4D4r/n5YlWWaL+N9JwPwlmt2Vhn09\nrWkR6lqLs+H0u2AxfDBiX9LSRgYZLkAGESYQylV2U1WQefXei57TOA9cOJlYb5MA\nB7i0Wxf16col89XxoNDC9PkF0zov1dtSVI3xuiLlp0HLwHS3WWHN1kv7fxJStKyU\nWtuxvjXIZv1fTmXgsCRzD7b5DJuzP/Q/71G0RW94099q0Ki3piWmHFGqKYe2VRCP\nu8z+TTJfAgMBAAECggEAKvgk1Snm3S5VcpBtlvGERwMldKplTLJREcOhFR3e/kbI\n4m0JWZ9q8zPGpLlyu7G3gIyXGsWnstSekuCjia3zkWjz4IgN0A2eHYrCA7VfdzXn\nL/uhmlaMuJiJJ2Bms7nJmUswttGo9660P0oIu+okvDr5yYIJJF8P0m8PtNF/jnGl\nZUw7R+Ds+acX7+VN+sbgv1eLbILbULtGt/ci+Os/YA4eLLg4ZXSWh9EVOCavD0WD\n5b78hrw+ovUEMjY8Ao+6mox7HfLW+w018Aw7uNYrmS8F1sBwV8GamNhQ2agL7LDA\ntq/r5ghfux9Uv5tgJpl5gaqwo6uUJjrFXC7dmMINWQKBgQDKt00Dr1ziuDTss/rq\nnhJcgrezjQAHcZiuY4pWg54hyUovwIidU3IPvotm8E1UNQyPH4VuPOOWXASlB0X1\n6vkzfMdCX5+s+OFmKBKK7ZeLX7RnGx4PFjmrdNovCyo5ufmLNQOdSPJ76Phi6bb6\nE0UfBQvQ7MUXqZdbDSnyNvJiaQKBgQDHXDfnDVIVPrAxWhQHzJzxQcfAPnc8aWG/\nJQNDx6SKCQpQT8HtmlC1ZseRrcunzCbXlCHGQOguVbuRCEQwIRJf7IsSGTb5Sh9g\n5ZbBDBvArw0y4cI1TqaDv/LYqTzkqFU8e9UScLr+BEWKvcnxxr9wgjiskALrDgbP\nx7lQ161FhwKBgQC8LzOwcw/wbH69KkuJl9qFxNeSOBfJ0Tui0EcxDxgyVzGmaL6q\nBjgBw6qXkgbHYEPbbbCpaJ8CC0RIixr4MvzKPlCgHjMWGSjtc8/a5rtjKCJKAROD\nf+djcqPFPkEhu7Kb90f2sCxiuSA0erBhMJhfNokEl3hUAhy+6taAw1952QKBgCvz\n//s36531eUEYPAxQJ1Xli9Wtr/oovb03utWJwZQRVC3Kt9XbzOmBpIRQzfLLxtCG\nvz+HdekpS7Y5HVeDIxr0+uBdoMordmmVlLwxIDlGHuHV9kxsb7fibPcpsNw05L32\nC08KfZ+db3ucRlbA29pBS594DLyoFgZfYVMaigAnAoGBAKnj5GCENihwQj+JWbAn\nq8daFIRaZ2QJJ4PeT5Fe26g1ABaqru0N31bKMJaqKXcBfGi5/+3RQ27zej2Y+9cg\ndH62cLTz2JH3RKTXl/a0wrr7VEKuQKeT648C9rg2V8WZeDMsZ5O6v/yd4R901zSG\nW0gAk/Exb4kWTmQ2qUxxgkGT\n-----END PRIVATE KEY-----\n',
        client_email: this.config.get<string>('CLIENT_EMAIL'),
      },
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
