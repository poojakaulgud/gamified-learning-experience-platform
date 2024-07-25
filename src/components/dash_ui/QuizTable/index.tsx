import { ReactNode } from 'react';

// import { ArrayItem } from '@/types/component/FilterButton';
interface QuizData {
  quiz_title: string;
  xp: number;
}

interface Unknown {
  [key: string]: ReactNode;
}

type Quizzes = Partial<QuizData & Unknown>;

// reusable table for course leaderboards
// needs to accept array of quizzes
export function QuizTable({ quizzes }: { quizzes: Quizzes[] }) {
  return (
    <div className="mt-5 h-64 w-full overflow-x-auto overflow-y-auto">
      <table className="w-full table-fixed overflow-x-auto">
        <thead className="rounded-lg bg-[#F5F5F5] p-4 text-left">
          <tr className="overflow-x-auto">
            <th className="w-48 rounded-l-lg py-3 pl-3">Quiz</th>
            <th className="w-24 rounded-r-lg py-3 pr-3">XP</th>
          </tr>
        </thead>
        <tbody className="">
          {quizzes.map((quiz, index) => (
            <tr className="" key={index}>
              <td className="rounded-s-lg py-3 pl-3">{quiz.quiz_title}</td>

              <td className="rounded-e-lg py-3 pr-3">{quiz.xp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
