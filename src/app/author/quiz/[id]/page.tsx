'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { IoMdArrowBack } from 'react-icons/io';

interface Question {
  question_text: string;
  options: { [key: string]: string } | string[];
  correct_option: number;
}

interface QuizData {
  questions: { [key: string]: Question };
  quiz_title: string;
}

const QuizDetails: React.FC = () => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchQuizData = async () => {
      if (params.id) {
        const quizRef = doc(db, 'quiz', params.id as string);
        const quizSnap = await getDoc(quizRef);
        if (quizSnap.exists()) {
          const quizData = quizSnap.data() as QuizData;
          console.log('Fetched Quiz Data:', quizData);
          setQuizData(quizData);
        } else {
          console.log('No such quiz!');
        }
      }
    };
    fetchQuizData();
  }, [params.id]);

  if (!quizData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  const questions = Object.values(quizData.questions);
  const currentQuestion = questions[currentQuestionIndex];

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
    }
  };

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const QuizContent = () => (
    <div className="mx-auto w-full max-w-lg rounded-lg bg-white p-6 shadow-md">
      <div className="mb-4 text-sm text-gray-500">
        {currentQuestionIndex + 1} of {questions.length}
      </div>
      <div className="mb-6 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-blue-600"
          style={{
            width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
          }}
        ></div>
      </div>
      <h2 className="mb-6 text-xl font-semibold text-black">
        {currentQuestion.question_text}
      </h2>
      <div className="space-y-4">
        {(Array.isArray(currentQuestion.options)
          ? currentQuestion.options
          : Object.entries(currentQuestion.options)
        ).map((option, optionIndex) => {
          const optionText = Array.isArray(currentQuestion.options)
            ? option
            : option[1];
          const isCorrect = optionIndex === currentQuestion.correct_option;
          const isSelected = optionIndex === selectedOption;
          return (
            <div
              key={optionIndex}
              className={`flex items-center justify-between rounded-lg p-3 ${
                isSelected && !isCorrect
                  ? 'border-2 border-red-500'
                  : isCorrect
                    ? 'border-2 border-green-500 bg-green-100'
                    : 'border border-gray-300 bg-gray-100'
              }`}
              role="button"
              tabIndex={0}
              onClick={() => handleOptionSelect(optionIndex)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleOptionSelect(optionIndex);
                }
              }}
            >
              <span className="text-[#737373]">{optionText}</span>
              {isSelected && !isCorrect && (
                <div className="text-red-500">Wrong Answer</div>
              )}
              {isCorrect && (
                <div className="flex items-center text-green-500">
                  <span className="mr-2">Correct Answer</span>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="rounded bg-gray-200 px-4 py-2 text-gray-800 disabled:opacity-50"
        >
          Previous Question
        </button>
        <button
          onClick={handleNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          className="rounded bg-[#4442E3] px-4 py-2 text-white disabled:opacity-50"
        >
          Next Question
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-8xl mx-auto w-full">
        <div className="mb-4 text-sm">
          <span className="text-black">Dashboard &gt; </span>
          <span className="font-semibold text-black">
            {quizData.quiz_title}
          </span>
        </div>
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/author/dashboard')}
            className="flex items-center text-blue-600"
          >
            <IoMdArrowBack className="mr-2" />
            <span>Questions</span>
          </button>
          <button
            onClick={() => router.push(`/author/metrics/${params.id}`)}
            className="rounded border bg-white px-4 py-2 text-black"
          >
            View Metrics
          </button>
        </div>
        <div className="w-full rounded-lg bg-white p-14 shadow-md">
          <div className="mb-4 flex justify-end">
            <span className="rounded-lg border border-[#B4B3F4] bg-[#DAD9F9] px-4 py-2 text-sm">
              Preview
            </span>
          </div>
          <QuizContent />
        </div>
      </div>
    </div>
  );
};

export default QuizDetails;
