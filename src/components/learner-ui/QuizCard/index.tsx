import React from 'react';
import { useRouter } from 'next/navigation';
import { FaHourglassStart, FaAward } from 'react-icons/fa6';

interface QuizCardProps {
  id: string;
  title: string;
  description: string;
  questions: number;
  time: number;
  isDone: boolean;
  course_title: string;
  courseId: string;
}

const QuizCard: React.FC<QuizCardProps> = ({
  id,
  title,
  description,
  questions,
  time,
  isDone,
  course_title,
  courseId,
}) => {
  const router = useRouter();

  const handleStartQuiz = () => {
    router.push(`/learner/quiz?id=${id}`);
  };

  const handleViewResults = () => {
    router.push(
      `/learner/result?quiz_id=${encodeURIComponent(id)}&course_title=${encodeURIComponent(course_title)}&quiz_title=${encodeURIComponent(title)}&courseId=${encodeURIComponent(courseId)}`
    );
  };

  return (
    <div className="inline-flex w-[17.25rem] flex-col items-start rounded-2xl bg-white px-7 py-8 shadow-lg">
      <div className="mb-1 flex flex-col items-start">
        {isDone ? (
          <FaAward className="h-[50px] w-[37px] text-indigo-400" />
        ) : (
          <FaHourglassStart className="h-[50px] w-[37px] text-indigo-400" />
        )}

        <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      </div>

      <div className="mb-6 flex items-center text-xs font-normal text-neutral-500">
        <span>
          {questions} questions, {time} mins
        </span>
      </div>
      <p className="font-normaltext-neutral-900 mb-6 text-xs">{description}</p>

      {isDone ? (
        <button
          className="mt-auto h-[3rem] w-full rounded-lg border-2 border-indigo-400 px-4 py-2 text-base font-bold text-indigo-400  transition-transform duration-100 ease-in-out hover:border-indigo-600 hover:text-indigo-600 active:border-indigo-900 active:text-indigo-900"
          onClick={handleViewResults}
        >
          View Results
        </button>
      ) : (
        <button
          className="mt-auto h-[3rem] w-full rounded-lg bg-indigo-600 px-4 py-2 text-base font-bold text-white transition-transform duration-100 ease-in-out hover:bg-indigo-800  active:bg-indigo-900"
          onClick={handleStartQuiz}
        >
          Start Quiz
        </button>
      )}
    </div>
  );
};

export default QuizCard;
