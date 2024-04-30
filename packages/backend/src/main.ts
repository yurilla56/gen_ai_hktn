import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swagger } from 'src/common/swagger/builder';
import { createValidationPipe } from 'src/common/pipes/validation.pipe';
import { json, urlencoded } from 'express';

export const main = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.setGlobalPrefix('api');
  app.useGlobalPipes(createValidationPipe());

  swagger(app);
  await app.listen(8080);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
