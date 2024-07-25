'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  fetchAddingQuizResult,
  fetchCourseTitle,
  fetchQuizById,
} from '@/services/quizService';
import { Timestamp } from 'firebase/firestore';
import { Inter } from 'next/font/google';
import { UserAuth } from '@/context/AuthContext';
import Header from '@/components/learner-ui/Header';
import Loading from '@/components/learner-ui/Loading';
import SubmitModal from '@/components/learner-ui/SubmitModal';
import WarningModal from '@/components/learner-ui/WarningModal';

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

type UserAnswers = {
  [questionId: number]: number;
};

const inter = Inter({
  subsets: ['latin'],
});

export default function QuizPage() {
  const { user } = UserAuth();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [courseTitle, setcourseTitle] = useState('');
  const router = useRouter();
  const [userAnswers, setuserAnswers] = useState<UserAnswers>({});
  const [startTime, setstartTime] = useState<Date | null>(null);
  const [isOpen, setisOpen] = useState(false);
  const [isBackErrorOpen, setisBackErrorOpen] = useState(false);

  // function to store the user answers in a map: key being the question index and value: option index

  const handleOptionSelect = (questionId: number, optionIndex: number) => {
    setuserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: optionIndex,
    }));
  };

  // fetching the quiz from the db as per the document id

  useEffect(() => {
    const fetchQuiz = async () => {
      if (id) {
        try {
          const result = await fetchQuizById(id);
          setQuiz(result as Quiz);
        } catch (error) {
          console.error('Error', error);
        }
      }
    };

    fetchQuiz();
  }, [id]);

  // fetching the course title for the breadcrumbs

  useEffect(() => {
    const fetchTitle = async () => {
      if (quiz) {
        try {
          const title = await fetchCourseTitle(quiz.course);
          setcourseTitle(title.title);
        } catch (error) {
          console.error('Error', error);
        }
      }
    };
    fetchTitle();
  }, [quiz]);

  // setting the start time of the quiz
  useEffect(() => setstartTime(new Date()), []);

  // function to handle submit: calculating and storing xp, percent, score

  const handleSubmit = async () => {
    if (!startTime) {
      console.log('Invalid start time');
      return;
    }

    const endTime = new Date();
    const totalTimeTaken = Math.floor(
      (endTime.getTime() - startTime.getTime()) / 1000
    );

    // Prepare the answers map
    const answersMap: Record<
      string,
      {
        is_correct: boolean;
        question_text: string;
        user_choice: number;
      }
    > = {};

    let score = 0;
    let total_points = 0;

    // checking if the quiz is valid
    if (quiz) {
      Object.entries(quiz.questions).forEach(
        ([questionId, question], index) => {
          let userChoice = userAnswers[Number(questionId)];
          const isCorrect = userChoice === question.correct_option;
          if (userChoice == undefined) {
            userChoice = -1;
          }

          answersMap[index] = {
            is_correct: isCorrect,
            question_text: question.question_text,
            user_choice: userChoice,
          };

          if (isCorrect) {
            score += question.points || 1;
          }

          total_points += question.points;
        }
      );

      // calculating percentage
      const percent = Math.round((score / total_points) * 100);

      // calculating xp based on percentage scored.
      let xp = 0;
      if (percent < 49) {
        xp = 10;
      } else if (percent >= 50 && percent < 80) {
        xp = 20;
      } else if (percent >= 80 && percent <= 100) {
        xp = 30;
      }

      // Prepare the data object for the cloud function
      const quizResultData = {
        user_uid: user.uid,
        quiz_id: id,
        answers: answersMap,
        scored_points: score,
        time_taken: totalTimeTaken,
        completed_at: endTime,
        percentage: percent,
        total_points: total_points,
        xp: xp,
      };

      try {
        const result = await fetchAddingQuizResult(quizResultData);
        console.log('Quiz result submitted successfully:', result);
        // Handle success (e.g., navigate to results page)
        router.replace(
          `/learner/result?quiz_id=${id}&course_title=${encodeURIComponent(courseTitle)}&quiz_title=${encodeURIComponent(quiz.quiz_title)}&courseId=${encodeURIComponent(quiz.course)}`
        );
      } catch (error) {
        console.error('Error submitting quiz result:', error);
        // Handle error (e.g., show error message to user)
      }
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      setisBackErrorOpen(true);
      return ''; // This is necessary to prevent the default prompt
    };

    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      setisBackErrorOpen(true);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  if (!quiz)
    return (
      <div>
        <Loading />
      </div>
    );

  const options = quiz.questions[currentQuestion].options;

  const breadcrumbs = [
    { label: 'Dashboard', href: '/learner/dashboard' },
    {
      label: courseTitle,
      href: `/learner/course?courseId=${quiz.course}`,
    },
    { label: quiz.quiz_title },
  ];

  return (
    <>
      <div className="h-[100%] w-[100%]">
        <div className="mb-[38px] mt-[44px]">
          <Header
            heading={quiz.quiz_title}
            items={breadcrumbs}
            backButtonClick={() => {
              setisBackErrorOpen(true);
            }}
          />
        </div>

        {/* Card view */}

        <div className="mx-auto h-[754px] w-[584px] flex-col justify-between rounded-[20px] border bg-white px-[24px] py-[40px] drop-shadow-2xl">
          <div className="h-[80%] w-auto bg-white">
            <div
              className={`text-base font-normal text-neutral-900 ${inter.className} h-[19.36px] text-[16px]`}
            >
              {currentQuestion + 1} of {Object.keys(quiz.questions).length}
            </div>

            {/* Progress bar */}

            <div className="mt-[24px] h-2.5 w-[100%] rounded-[20px] bg-neutral-100">
              <div
                className="h-2.5 rounded-[20px] bg-indigo-600"
                style={{
                  width: `${((currentQuestion + 1) * 100) / Object.keys(quiz.questions).length}%`,
                }}
              ></div>
            </div>

            {/* Question */}

            <div
              className={`my-[40px] w-[100%] text-lg font-bold text-neutral-900 ${inter.className} h-auto overflow-hidden`}
            >
              {quiz.questions[currentQuestion].question_text}
            </div>

            {/* Options */}

            <div className="h-[336px] w-[100%] bg-white">
              {Object.entries(options).map(([key, option], index: number) => (
                <label
                  className={`mb-8 flex max-h-[66px] min-h-[60px] w-[100%] cursor-pointer items-center rounded-lg bg-neutral-100 px-6 py-3.5 hover:bg-gray-200 ${userAnswers[currentQuestion] === index ? 'border-[3px] border-indigo-400' : ''}`}
                  key={key}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion}`}
                    checked={userAnswers[currentQuestion] === index}
                    value={index}
                    onChange={() => handleOptionSelect(currentQuestion, index)}
                    className="hidden"
                  />
                  <div
                    className={`text-base font-normal text-neutral-500 ${inter.className} w-[100%]`}
                  >
                    {option}
                  </div>
                  <div
                    className={`relative right-1 flex h-8 w-8 flex-shrink-0 justify-center rounded-full ${
                      userAnswers[currentQuestion] === index
                        ? 'border-2 border-indigo-600 bg-neutral-300'
                        : 'bg-neutral-300'
                    }`}
                  >
                    {userAnswers[currentQuestion] === index ? (
                      <div className="mt-[26.5%] h-[50%] w-[50%] rounded-full bg-indigo-600"></div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons at the bottom */}

          <div className="mt-[10%] grid h-[67px] w-auto grid-cols-2 gap-[36px] bg-white">
            <button
              className={`h-[67px] w-auto rounded-lg border-2 border-indigo-400 bg-white text-center text-indigo-400 hover:border-indigo-600 hover:text-indigo-600  ${inter.className} ${currentQuestion === 0 ? 'opacity-20' : 'opacity-100'}`}
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              disabled={currentQuestion === 0}
            >
              Previous Question
            </button>
            {currentQuestion === Object.keys(quiz.questions).length - 1 ? (
              <button
                className={`h-[67px] w-auto rounded-lg bg-indigo-600 text-center text-white ${inter.className} hover:bg-indigo-800`}
                onClick={() => {
                  setisOpen(true);
                }}
              >
                Submit
              </button>
            ) : (
              <button
                className={`h-[67px] w-auto rounded-lg bg-indigo-600 text-center text-white ${inter.className} hover:bg-indigo-800`}
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
              >
                Next Question
              </button>
            )}
          </div>
        </div>
      </div>
      <SubmitModal
        isOpen={isOpen}
        onClose={() => {
          setisOpen(false);
        }}
        onSubmit={handleSubmit}
      />
      <WarningModal
        isOpen={isBackErrorOpen}
        onClose={() => {
          setisBackErrorOpen(false);
        }}
        onClick={() => {
          router.push(`/learner/course?courseId=${quiz.course}`);
        }}
      />
    </>
  );
}
