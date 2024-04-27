import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swagger } from 'src/common/swagger/builder';
import { createValidationPipe } from 'src/common/pipes/validation.pipe';

export const main = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(createValidationPipe());

  swagger(app);
  await app.listen(8080);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
