import { Module } from '@nestjs/common';
import { QuizController } from './quize.controller';
import { QuizService } from './quize.service';

@Module({
  imports: [],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
