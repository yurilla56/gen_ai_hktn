import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LogMiddleware } from './common/middlewares/log.middleware';
import { WeatherModule } from './features/weather/weather.module';
import { StableDiffusionModule } from './features/stable-diffusion/stable-diffusion.module';
import { QuizModule } from './features/quizzes/quiz.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), WeatherModule, StableDiffusionModule, QuizModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('*');
  }
}
