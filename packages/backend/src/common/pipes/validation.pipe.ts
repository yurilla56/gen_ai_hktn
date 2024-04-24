import { BadRequestException, ValidationPipe } from '@nestjs/common';

export const createValidationPipe = (): ValidationPipe => {
  return new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
    forbidUnknownValues: true,
    whitelist: true,
    exceptionFactory: (errors) => new BadRequestException(errors),
  });
};
