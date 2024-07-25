'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/learner-ui/Header';
import { fetchQuizResultForUser } from '@/services/quizService';
import { UserAuth } from '@/context/AuthContext';
import Loading from '@/components/learner-ui/Loading';
import { useSearchParams } from 'next/navigation';
import { FaAward } from 'react-icons/fa6';

const QuizResultsPage = () => {
  const { user } = UserAuth();
  const user_id: string = user.uid || '';

  const searchParams = useSearchParams();
  const quiz_id = searchParams.get('quiz_id') || '';
  const courseTitle = searchParams.get('course_title') || '';
  const quizTitle = searchParams.get('quiz_title') || '';
  const courseId = searchParams.get('courseId') || '';

  const [loading, setLoading] = useState<boolean>(true);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getQuizResults = async () => {
      setLoading(true);
      try {
        if (!quiz_id) {
          throw new Error('quiz id is required');
        }
        if (!user_id || user_id.trim() === '') {
          throw new Error('user id is required');
        }

        const result = await fetchQuizResultForUser(user_id, quiz_id);
        setQuizResult(result[0]);
        console.log('Quiz result in result page', result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching quiz result:', error);
        setError((error as Error).message);
        setLoading(false);
      }
    };
    if (quiz_id && user_id) {
      getQuizResults();
    }
  }, [quiz_id, user_id]);

  const router = useRouter();

  const handleReviewAnswers = () => {
    router.push(
      `/learner/review?quiz_id=${encodeURIComponent(quiz_id)}&course_title=${encodeURIComponent(courseTitle)}&quiz_title=${encodeURIComponent(quizTitle)}`
    );
  };

  const handleGoToCoursePage = () => {
    router.push(`/learner/course?courseId=${courseId}`);
  };

  const handleGoToDashboard = () => {
    router.push('/learner/dashboard');
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/learner/dashboard' },
    {
      label: courseTitle,
      href: `/learner/course?courseId=${courseId}`,
    },
    { label: quizTitle },
    { label: 'Quiz Result' },
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

  const scorePercentage = quizResult ? Math.round(quizResult.percentage) : 0;
  const correctAnswers = quizResult ? quizResult.scored_points : 0; // Adjust according to your data structure
  const totalQuestions = quizResult ? quizResult.total_points : 0; // Adjust according to your data structure
  const incorrectAnswers = totalQuestions - correctAnswers;
  const earnedXP = quizResult ? quizResult.xp : 0;
  const totalXP = 100; // Replace with actual total XP if available

  return (
    <div className="max-w-full">
      <div className="mx-auto p-10">
        <Header
          heading={quizTitle}
          items={breadcrumbs}
          backButtonClick={handleGoToCoursePage}
        />
        <div className="flex items-center justify-center">
          <div className="h-[40rem] w-[36rem] rounded-lg bg-white p-8 text-center shadow-lg drop-shadow-xl">
            <p className="text-xl text-neutral-900">
              You have completed the quiz
            </p>
            <h2 className="mt-2 text-4xl font-bold text-neutral-900">
              {quizTitle}
            </h2>
            <div className="my-12 flex justify-center">
              <FaAward className="h-[160px] w-[119px] text-indigo-600" />
            </div>

            <div className="mt-4 flex justify-around text-neutral-500">
              <div className="text-center">
                <span className="text-xl font-bold">You scored</span>
                <div className="w-[134px] text-center">
                  <span className="overflow-hidden text-6xl font-bold text-indigo-600">
                    {scorePercentage}
                  </span>
                  <span className="text-4xl font-bold text-indigo-600">%</span>
                </div>
                <span className="text-lg">
                  {incorrectAnswers}/{totalQuestions} missed
                </span>
              </div>
              <div className="text-center">
                <span className="text-xl font-bold">You got</span>
                <div className="w-[134px] text-center">
                  <span className="text-6xl font-bold text-indigo-600">
                    {correctAnswers}
                  </span>
                  <span className="text-4xl font-bold text-indigo-600">
                    /{totalQuestions}
                  </span>
                </div>
                <span className="text-lg">correct</span>
              </div>
              <div className="text-center">
                <span className="text-xl font-bold">You earned</span>
                <div className="w-[134px] text-center">
                  <span className="text-6xl font-bold text-indigo-600">
                    {earnedXP}
                  </span>
                  <span className="text-4xl font-bold text-indigo-600">xp</span>
                </div>
                <span className="text-lg">{totalXP}xp total</span>
              </div>
            </div>
            <div className="mb-12 mt-20 flex justify-center space-x-4">
              <button
                className="mt-auto h-16 flex-1 rounded-lg border-2 border-indigo-400 px-4 py-2 text-base font-bold text-indigo-400  transition-transform duration-100 ease-in-out hover:border-indigo-600 hover:text-indigo-600 active:border-indigo-900 active:text-indigo-900"
                onClick={handleReviewAnswers}
              >
                Review My Answers
              </button>
              <button
                className="mt-auto h-16 flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-base font-bold text-white transition-transform duration-100 ease-in-out hover:bg-indigo-800  active:bg-indigo-900"
                onClick={handleGoToDashboard}
              >
                Go To Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResultsPage;
