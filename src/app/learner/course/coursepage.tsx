'use client';

import QuizCard from '@/components/learner-ui/QuizCard';
import {
  fetchQuizzesByCourse,
  fetchCourseTitle,
  fetchAllQuizResultsForUser,
} from '@/services/quizService';
import React, { useEffect, useState } from 'react';
import Loading from '@/components/learner-ui/Loading';
import Header from '@/components/learner-ui/Header';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserAuth } from '@/context/AuthContext';

const CourseQuizzesPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [courseTitle, setCourseTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const courseId = searchParams.get('courseId') || '';

  // Sample variables for testing only
  // Need to recieve these as parameters
  const { user } = UserAuth();
  const userId: string = user.uid || '';

  const breadcrumbs = [
    { label: 'Dashboard', href: '/learner/dashboard' },
    { label: courseTitle },
  ];

  const router = useRouter();

  // Back button redirects to dashboard
  const handleGoToDashboard = () => {
    router.push('/learner/dashboard');
  };

  useEffect(() => {
    const getCourseAndQuizzes = async () => {
      setLoading(true);
      try {
        if (!courseId) {
          throw new Error('course id is required');
        }

        if (!userId) {
          throw new Error('user id is required');
        }

        // Fetch course title by course ID
        const courseData = await fetchCourseTitle(courseId);
        console.log('Course Data:', courseData);
        setCourseTitle(courseData.title);

        // Fetch all quizzes that match the course ID
        const quizzesData = await fetchQuizzesByCourse(courseId);
        // console.log('Quizzes Data:', quizzesData);

        // Fetch quiz results that match the user ID and update the quizzes

        const userQuizResults = await fetchAllQuizResultsForUser(userId);
        console.log('User Quiz Results:', userQuizResults);
        const updatedQuizzes = quizzesData.map((quiz: any) => {
          const isDone = userQuizResults.some(
            (result: any) => result.quiz_id === quiz.id
          );
          return { ...quiz, isDone };
        });
        setQuizzes(updatedQuizzes);

        // console.log('Updated Quiz Data:', updatedQuizzes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course and quizzes:', error);
        setLoading(false);
      }
    };
    if (userId) {
      getCourseAndQuizzes();
    }
  }, [userId, courseId]);

  return (
    <div className="max-w-full">
      {loading ? (
        <Loading />
      ) : (
        <div className="mx-auto p-10">
          <Header
            heading={courseTitle}
            items={breadcrumbs}
            backButtonClick={handleGoToDashboard}
          />
          <div className="ml-6 mr-6 flex justify-center">
            <div className="flex flex-wrap gap-6">
              {quizzes.map((quiz, index) => (
                <QuizCard
                  key={index}
                  id={quiz.id}
                  course_title={courseTitle}
                  title={quiz.quiz_title}
                  description={quiz.description}
                  questions={quiz.total_points}
                  time={quiz.est_time}
                  isDone={quiz.isDone}
                  courseId={courseId}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseQuizzesPage;
