import * as fs from 'fs';
import * as path from 'path';

export class QuizService {
  private quizzes: any[];

  constructor() {}

  async getAllQuizzes() {
    const filePath = path.resolve(__dirname, './quizzes.json');
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    const quizzes = JSON.parse(fileContent);

    return quizzes;
  }
}
