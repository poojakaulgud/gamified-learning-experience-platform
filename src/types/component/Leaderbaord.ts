import { ReactNode } from 'react';
interface QuizData {
  quiz_title: string;
  xp: number;
}

interface Unknown {
  [key: string]: ReactNode;
}

export type Quizzes = Partial<QuizData & Unknown>;
