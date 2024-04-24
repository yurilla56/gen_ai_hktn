import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swagger = (app: INestApplication<unknown>) => {
  const config = new DocumentBuilder()
    .setTitle('Google AI Hackathon: Weather Assistant')
    .setDescription('API Documentation for backend')
    .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'x-api-key')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, { useGlobalPrefix: true });
};
