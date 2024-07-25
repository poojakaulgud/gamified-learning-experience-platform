'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/learner-ui/Header';
import { fetchQuizResultForUser, fetchQuizById } from '@/services/quizService';
import { UserAuth } from '@/context/AuthContext';
import CheckCircle from '@/components/learner-ui/CheckCircle';
import CrossCircle from '@/components/learner-ui/CrossCircle';
import Loading from '@/components/learner-ui/Loading';
import { Inter } from 'next/font/google';
import { Timestamp } from 'firebase/firestore';

interface QuestionDetails {
  question: string;
  options: string[];
  correctOptionIndex: number;
  chosenOptionIndex: number;
  correctOptionText: string;
  chosenOptionText: string;
}

interface Quiz {
  course: string;
  created_at: Timestamp;
  created_by: string;
  description: string;
  edited_by: string;
  est_time_to_complete: number;
  is_active: boolean;
  is_deleted: boolean;
  lastEdited_at: Timestamp;
  published_at: Timestamp;
  published_by: string;
  questions: {
    [key: string]: {
      correct_option: number;
      options: string[];
      points: number;
      question_format: string;
      question_text: string;
    };
  };
  quiz_title: string;
  total_points: number;
}

const inter = Inter({
  subsets: ['latin'],
});

const ReviewAnswers: React.FC = () => {
  const [open, setOpen] = useState<boolean[]>([]);
  const [questions, setQuestions] = useState<QuestionDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quizDetails, setquizDetails] = useState<Quiz | null>(null);

  const { user } = UserAuth();
  const user_id: string = user.uid || '';

  const searchParams = useSearchParams();
  const quiz_id = searchParams.get('quiz_id') || '';
  const courseTitle = searchParams.get('course_title') || '';
  const quizTitle = searchParams.get('quiz_title') || '';

  const router = useRouter();

  useEffect(() => {
    const getReviewData = async () => {
      setLoading(true);
      try {
        if (!quiz_id) {
          throw new Error('quiz_id is required');
        }
        if (!user_id || user_id.trim() === '') {
          throw new Error('user_id is required');
        }

        const quizResult = await fetchQuizResultForUser(user_id, quiz_id);
        const quizDetails = await fetchQuizById(quiz_id);

        const answers = quizResult[0].answers;
        const questions = quizDetails.questions;

        const parsedQuestions: QuestionDetails[] = Object.keys(answers).map(
          (key) => {
            const answer = answers[key];
            const question = questions[key];
            const chosenOptionIndex = answer.user_choice;
            const correctOptionIndex = question.correct_option;

            // Convert options object to array
            const optionsArray = Object.keys(question.options).map(
              (k) => question.options[k]
            );

            return {
              question: question.question_text,
              options: optionsArray,
              correctOptionIndex,
              chosenOptionIndex,
              correctOptionText: optionsArray[correctOptionIndex],
              chosenOptionText: optionsArray[chosenOptionIndex],
            };
          }
        );

        setQuestions(parsedQuestions);
        setquizDetails(quizDetails);
        setOpen(new Array(parsedQuestions.length).fill(false));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching review data:', error);
        setError((error as Error).message);
        setLoading(false);
      }
    };

    if (quiz_id && user_id) {
      getReviewData();
    }
  }, [quiz_id, user_id]);

  const toggleDropdown = (index: number) => {
    setOpen(open.map((state, i) => (i === index ? !state : state)));
  };

  const handleGoToResultPage = () => {
    router.push(
      `/learner/result?quiz_id=${encodeURIComponent(quiz_id)}&course_title=${encodeURIComponent(courseTitle)}&quiz_title=${encodeURIComponent(quizTitle)}&courseId=${quizDetails?.course}`
    );
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/learner/dashboard' },
    {
      label: courseTitle,
      href: `/learner/course?courseId=${quizDetails?.course}`,
    },
    { label: quizTitle },
    {
      label: 'Quiz Result',
      href: `/learner/result?quiz_id=${quiz_id}&course_title=${courseTitle}&quiz_title=${quizTitle}&courseId=${quizDetails?.course}`,
    },
    { label: 'Review Answers' },
  ];

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="h-[100%] max-w-full">
      {loading ? (
        <Loading />
      ) : (
        <div className="mx-auto p-10">
          <Header
            heading={quizTitle}
            items={breadcrumbs}
            backButtonClick={handleGoToResultPage}
          />
          <div className="mx-[10%] mt-[3%]">
            {questions.map((question, index) => (
              <div key={index} className="mb-4">
                <div className="overflow-hidden rounded-2xl bg-white shadow">
                  <button
                    onClick={() => toggleDropdown(index)}
                    className={`duration-30 flex w-full items-center justify-between border px-8 py-6 text-left transition-all`}
                  >
                    <div className="flex w-[80%] items-center">
                      <span className="mr-[26px] flex-shrink-0">
                        {question.chosenOptionIndex ===
                        question.correctOptionIndex ? (
                          <CheckCircle />
                        ) : (
                          <CrossCircle />
                        )}
                      </span>
                      <div
                        className={`flex-grow text-base font-medium text-neutral-900 ${inter.className}`}
                      >
                        {question.question}
                      </div>
                    </div>
                    <svg
                      className={`h-6 w-6 transform ${open[index] ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                  <div
                    className={`bg-white px-8 transition-all duration-200 ease-in-out ${open[index] ? 'max-h-[1000px] py-6 opacity-100' : 'max-h-0 overflow-hidden py-0 opacity-0'}`}
                  >
                    <div className="mb-4 flex justify-between">
                      <div className="w-[50%]">
                        {' '}
                        {/* Adjust width as needed */}
                        {question.options.map((option, idx) => (
                          <div className="mb-2 flex items-center" key={idx}>
                            <div
                              className={`flex h-auto w-full items-center justify-between rounded-lg border-2 px-6 py-3.5 ${
                                idx === question.correctOptionIndex
                                  ? 'border-green-700 bg-green-100'
                                  : idx === question.chosenOptionIndex &&
                                      idx === question.correctOptionIndex
                                    ? 'border-green-700 bg-green-100'
                                    : question.chosenOptionIndex === idx
                                      ? 'border-red-700 bg-red-100'
                                      : 'bg-neutral-100'
                              }`}
                            >
                              <div
                                className={`flex-grow text-base font-normal text-neutral-500 ${inter.className}`}
                              >
                                {option}
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                {idx === question.correctOptionIndex && (
                                  <CheckCircle />
                                )}
                                {idx === question.chosenOptionIndex &&
                                  idx !== question.correctOptionIndex && (
                                    <CrossCircle />
                                  )}
                                {idx !== question.chosenOptionIndex &&
                                  idx !== question.correctOptionIndex && (
                                    <div className="h-8 w-8 rounded-[20px] bg-neutral-300"></div>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-12 w-[28%]">
                        {' '}
                        {/* Adjust width as needed */}
                        {question.chosenOptionIndex !== -1 ? (
                          <div className={`mb-4 ${inter.className}`}>
                            <div className="mb-2 text-lg font-bold text-neutral-900">
                              You Answered:
                            </div>
                            <div
                              className={`rounded-md pl-1 ${question.chosenOptionIndex === question.correctOptionIndex ? 'text-green-600' : 'text-red-600'}`}
                            >
                              {question.chosenOptionText}
                            </div>
                          </div>
                        ) : (
                          <div className="mb-2 text-lg font-bold text-red-600">
                            This question was unanswered
                          </div>
                        )}
                        <div className={`${inter.className}`}>
                          <div className="mb-1 text-lg font-bold text-neutral-900">
                            Correct Answer:
                          </div>
                          <div className="rounded-md p-1 text-green-600">
                            {question.correctOptionText}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewAnswers;
