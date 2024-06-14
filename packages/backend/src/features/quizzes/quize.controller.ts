import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { QuizService } from './quize.service';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';

@ApiTags('Quizzes')
@ApiSecurity('x-api-key')
@UseGuards(ApiKeyGuard)
@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @ApiResponse({
    status: 200,
    description: 'OK',
    type: [Object],
  })
  @Get()
  getQuizzes() {
    return this.quizService.getAllQuizzes();
  }
}
