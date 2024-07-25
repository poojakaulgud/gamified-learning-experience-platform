/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa6';
import { FaTrashAlt, FaSave } from 'react-icons/fa';
import { IoAddCircleOutline, IoAddCircle } from 'react-icons/io5';
import { HiOutlineArrowSmLeft } from 'react-icons/hi';
import { FaGear } from 'react-icons/fa6';
import { db } from '@/firebase/firebaseConfig';
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import PublishModal from '../publish_popup';
import SaveModal from '../save_modal';
import SettingsModal from '../settings_modal';
import Breadcrumb from '../breadcrumb_create';
import ErrorModal from '../publish_error_popup';

type Question = {
  correct_option: number;
  options: string[];
  points: number;
  question_format: 'mcq' | '2truths' | 'truefalse' | 'fib';
  question_text: string;
};

type QuizData = {
  course: string;
  created_at: any;
  created_by: string;
  edited_by: string;
  is_active: boolean;
  is_deleted: boolean;
  lastEdited_at: any;
  quiz_title: string;
  description: string;
  total_points: number;
  questions: Record<number, Question>;
  published_by: string;
  published_at?: any;
  est_time_to_complete: number;
};

const QuizCreator: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [quizMetadata, setQuizMetadata] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([
    {
      correct_option: 0,
      options: ['', ''],
      points: 1,
      question_format: 'mcq',
      question_text: '',
    },
  ]);
  const [quizTitle, setQuizTitle] = useState<string>('');
  const [quizDescription, setQuizDescription] = useState<string>('');
  const [quizDuration, setQuizDuration] = useState<number | null>(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; title: string }[]>(
    []
  );
  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | null
  >(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      const fetchedCategories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
      }));
      setCategories(fetchedCategories);
    };

    fetchCategories();
  }, []);

  const backbutton = () => {
    router.push('/author/dashboard');
  };

  const handleModalSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    metadata: any
  ) => {
    event.preventDefault();
    setQuizMetadata(metadata);
    setIsModalOpen(false);
  };

  const handlePublishModalSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    metadata: any
  ) => {
    event.preventDefault();
    if (
      !metadata.quiz_title ||
      !metadata.description ||
      !metadata.est_time_to_complete ||
      !metadata.course
    ) {
      alert('Please fill all metadata fields.');
      return;
    }

    setQuizMetadata(metadata);

    if (!selectedCategory) {
      alert(
        'You need to at least put in the quiz category to publish the quiz.'
      );
      return;
    }

    if (questions.length > 0) {
      const allQuestionsFilled = questions.every(
        (question) =>
          question.question_text.trim() !== '' &&
          question.options.every((option) => option.trim() !== '')
      );

      if (!allQuestionsFilled) {
        setIsErrorModalOpen(true); // Open the Error Modal
        return;
      }

      const totalPoints = questions.reduce(
        (acc, question) => acc + question.points,
        0
      );

      const questionsMap = questions.reduce(
        (acc, question, index) => {
          acc[index] = question;
          return acc;
        },
        {} as Record<number, Question>
      );

      const timestamp = serverTimestamp();
      const quizData: QuizData = {
        ...metadata,
        questions: questionsMap,
        total_points: totalPoints,
        created_at: timestamp,
        created_by: '',
        edited_by: '',
        is_active: true,
        is_deleted: false,
        lastEdited_at: timestamp,
        published_by: '',
        published_at: timestamp,
      };

      await addDoc(collection(db, 'quiz'), quizData);
      setQuizMetadata(null);
      router.push('/author/dashboard');
    } else {
      setIsErrorModalOpen(true); // Open the Error Modal
    }

    setIsPublishModalOpen(false);
  };

  const addOption = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push('');
    setQuestions(newQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(newQuestions);
  };

  const addQuestion = (currentQuestionIndex: number) => {
    if (questions.length >= 10) {
      alert('Max questions allowed are 10 only');
      return;
    }

    const newQuestion: Question = {
      correct_option: 0,
      options: ['', ''],
      points: 1,
      question_format: 'mcq',
      question_text: '',
    };

    const newQuestions = [...questions];
    newQuestions.splice(currentQuestionIndex + 1, 0, newQuestion);
    setQuestions(newQuestions);
  };

  const removeQuestion = (questionIndex: number) => {
    if (questions.length === 1) {
      alert("Can't delete the only question");
      return;
    }
    const newQuestions = questions.filter(
      (_, index) => index !== questionIndex
    );
    setQuestions(newQuestions);
  };

  const setCorrectOption = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correct_option = optionIndex;
    setQuestions(newQuestions);
  };

  const handleQuestionFormatChange = (
    questionIndex: number,
    format: Question['question_format']
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].question_format = format;
    switch (format) {
      case 'mcq':
      case 'fib':
        newQuestions[questionIndex].options = ['', ''];
        break;
      case 'truefalse':
        newQuestions[questionIndex].options = ['True', 'False'];
        newQuestions[questionIndex].correct_option = 0;
        break;
      case '2truths':
        newQuestions[questionIndex].options = ['', '', ''];
        break;
      default:
        break;
    }
    setQuestions(newQuestions);
  };

  const saveQuiz = async () => {
    if (!selectedCategory) {
      alert('You need to at least put in the quiz category to save the quiz.');
      return;
    }

    if (quizMetadata && questions.length > 0) {
      const totalPoints = questions.reduce(
        (acc, question) => acc + question.points,
        0
      );

      const questionsMap = questions.reduce(
        (acc, question, index) => {
          acc[index] = question;
          return acc;
        },
        {} as Record<number, Question>
      );

      const timestamp = serverTimestamp();
      const quizData: QuizData = {
        ...quizMetadata,
        questions: questionsMap,
        total_points: totalPoints,
        created_at: timestamp,
        created_by: '',
        edited_by: '',
        is_active: false,
        is_deleted: false,
        lastEdited_at: timestamp,
        published_by: '',
        published_at: timestamp,
      };
      await addDoc(collection(db, 'quiz'), quizData);
      setQuizMetadata(null);
      router.push('/author/dashboard');
    } else {
      alert('Please provide the quiz details via settings before publishing.');
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find((cat) => cat.id === selectedCategory);
      setSelectedCategoryName(category ? category.title : null);
    } else {
      setSelectedCategoryName(null);
    }
  }, [selectedCategory, categories]);

  // eslint-disable-next-line arrow-body-style
  const isAnyQuestionFilled = () => {
    return questions.some((question) => question.question_text.trim() !== '');
  };

  return (
    <>
      <Breadcrumb quizTitle={quizTitle} />
      <div className="mb-4 mt-0 px-4 sm:px-2 sm:py-4 md:px-8 lg:px-16 xl:px-24">
        <div className="flex w-full flex-col items-center justify-between md:flex-row">
          <div className="mb-4 flex w-full items-center md:mb-0 md:w-auto">
            <button className="mr-6 text-black" onClick={backbutton}>
              <HiOutlineArrowSmLeft className="text-3xl" />
            </button>
            <input
              type="text"
              placeholder="Untitled Quiz 1"
              className="mr-4 w-full rounded border p-2 text-xl text-black md:w-auto"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="ml-2 text-black"
            >
              <FaGear className="text-3xl hover:rotate-45" />
            </button>
          </div>
          <SettingsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleModalSubmit}
            quizTitle={quizTitle}
            quizDescription={quizDescription}
            quizDuration={quizDuration}
            selectedCategory={selectedCategory}
            setQuizTitle={setQuizTitle}
            setQuizDescription={setQuizDescription}
            setQuizDuration={setQuizDuration}
            setSelectedCategory={setSelectedCategory}
          />
          <div className="mt-4 flex w-full items-center space-x-2 xs:mx-20 xs:px-10 md:mt-0 md:w-auto">
            <button
              className={`flex w-24 items-center justify-center rounded p-2 ${
                isAnyQuestionFilled()
                  ? 'bg-indigo-600 text-white'
                  : 'bg-neutral-200 text-neutral-900'
              }`}
              onClick={() => setIsPublishModalOpen(true)}
              disabled={!isAnyQuestionFilled()}
            >
              Publish
            </button>
            <button
              className="flex w-24 items-center justify-center rounded bg-indigo-600 p-2 text-white"
              onClick={() => setIsSaveModalOpen(true)}
            >
              <FaSave className="mr-1" />
              Save
            </button>
          </div>
        </div>
        <p className="mb-3 mt-4 text-sm text-gray-600 xs:mb-10">
          You can add up to {10 - questions.length} more questions to complete
          the quiz
        </p>
      </div>
      {questions.map((question, questionIndex) => (
        <div
          key={questionIndex}
          className="-mt-5 flex flex-col items-center xs:mb-10 xs:w-3/5 xs:text-xs sm:px-2 sm:py-4 md:mb-5 md:w-4/5 md:px-8 lg:w-4/5 xl:w-4/5"
          style={{
            transition: 'all 0.3s ease-in-out',
            transform:
              selectedQuestionIndex === questionIndex ? 'scale(1.05)' : 'none',
            marginLeft:
              selectedQuestionIndex === questionIndex ? 'auto' : 'auto',
            marginRight: 'auto',
          }}
        >
          <div
            key={questionIndex}
            className="relative mb-7 flex w-full flex-col items-start rounded-lg border border-neutral-400 bg-white px-6 py-8 shadow md:w-5/6 md:flex-row md:items-center"
          >
            <div className="flex-1">
              <label className="mb-4 ml-5 block text-xl font-medium text-gray-700">
                Question {questionIndex + 1}
              </label>

              <div className="md-w-full mb-4 flex flex-col items-start 2xs:w-1/2 2xs:items-start xs:w-full md:flex-row md:items-center md:justify-between">
                <input
                  type="text"
                  placeholder={
                    question.question_format === '2truths'
                      ? 'Untitled Question (Select a lie as the answer)'
                      : 'Untitled Question'
                  }
                  className={`ml-6  h-14 w-full rounded-lg border p-2 text-black 2xs:ml-0 md:ml-6 md:mr-2 md:w-3/4 ${
                    question.question_text.length > 120
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                  value={question.question_text}
                  onFocus={() => setSelectedQuestionIndex(questionIndex)}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length > 120) {
                      alert('Maximum characters reached for the question.');
                    }
                    const newQuestions = [...questions];
                    newQuestions[questionIndex].question_text = value.slice(
                      0,
                      120
                    );
                    setQuestions(newQuestions);
                  }}
                />
                <select
                  className="mb-4 ml-4 mr-6 mt-1 w-full rounded-md border p-2 text-black 2xs:ml-0 md:ml-5 md:w-auto"
                  value={question.question_format}
                  onChange={(e) =>
                    handleQuestionFormatChange(
                      questionIndex,
                      e.target.value as Question['question_format']
                    )
                  }
                >
                  <option value="mcq">Multiple Choice</option>
                  <option value="fib">Fill in the Blanks</option>
                  <option value="truefalse">True or False</option>
                  <option value="2truths">2 Truths and a Lie</option>
                </select>
              </div>
              <div>
                {question.question_format === 'mcq' && (
                  <p className="-mt-3 mb-3 ml-6 text-sm text-black">
                    Please select the correct answer below
                  </p>
                )}
                {question.question_format === 'fib' && (
                  <p className="-mt-3 mb-3 ml-6 text-sm text-black">
                    Please select the correct answer below
                  </p>
                )}
                {question.question_format === '2truths' && (
                  <p className="-mt-3 mb-3 ml-6 text-sm text-black">
                    Please select the lie of all the options below
                  </p>
                )}
                {question.question_format === 'truefalse' && (
                  <p className="-mt-3 mb-3 ml-6 text-sm text-black">
                    Please select True or False
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                {question.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="flex flex-col items-start">
                    <div className="flex w-full items-center px-6">
                      <input
                        type="radio"
                        className="mr-2 text-2xl text-indigo-800"
                        name={`question-${questionIndex}`}
                        checked={question.correct_option === optionIndex}
                        onChange={() =>
                          setCorrectOption(questionIndex, optionIndex)
                        }
                      />
                      <div className="relative w-full">
                        <input
                          type="text"
                          placeholder="Input Option"
                          className={`mb-1 w-full rounded-lg border p-2 pr-10 text-black ${
                            option.length > 60
                              ? 'border-red-500'
                              : question.correct_option === optionIndex
                                ? 'border-green-500'
                                : 'border-gray-300'
                          }`}
                          value={option}
                          disabled={question.question_format === 'truefalse'}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length > 60) {
                              alert(
                                'Maximum characters reached for the answer.'
                              );
                            }
                            const newQuestions = [...questions];
                            newQuestions[questionIndex].options[optionIndex] =
                              value.slice(0, 60);
                            setQuestions(newQuestions);
                          }}
                        />
                        {(question.question_format === 'mcq' ||
                          question.question_format === 'fib') &&
                          question.options.length > 2 && (
                            <button
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-base text-black hover:text-red-600"
                              onClick={() =>
                                removeOption(questionIndex, optionIndex)
                              }
                            >
                              <FaTrash />
                            </button>
                          )}
                      </div>
                    </div>
                    {question.correct_option === optionIndex && (
                      <p style={{ color: '#15803D' }} className="ml-16 mt-1">
                        Correct answer
                      </p>
                    )}
                  </div>
                ))}
                {(question.question_format === 'mcq' ||
                  question.question_format === 'fib') &&
                  question.options.length < 4 && (
                    <button
                      className="ml-12 mr-6 inline-flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-300"
                      onClick={() => addOption(questionIndex)}
                    >
                      <IoAddCircleOutline className="text-xl" />
                      <span>Add Option</span>
                    </button>
                  )}
              </div>
            </div>
            {selectedQuestionIndex === questionIndex && (
              <div
                className="absolute right-[-80px] top-1 mr-3 mt-0 flex flex-col items-center justify-center space-y-1 divide-y-2 rounded-2xl border border-neutral-400 bg-white p-2 shadow"
                style={{
                  transition: 'all 0.3s ease-in-out',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  transform: 'scale(1.1)',
                }}
              >
                <div>
                  <button
                    className="p-1 text-black hover:text-blue-700"
                    onClick={() => addQuestion(questionIndex)}
                  >
                    <IoAddCircle className="mt-2 text-2xl" />
                  </button>
                </div>
                <div>
                  <button
                    className="p-1 text-black hover:text-red-700"
                    onClick={() => removeQuestion(questionIndex)}
                  >
                    <FaTrashAlt className="mb-2 mt-3 text-xl" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      <PublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onSubmit={handlePublishModalSubmit}
        quizTitle={quizTitle}
        quizDescription={quizDescription}
        quizDuration={quizDuration}
        selectedCategory={selectedCategory}
        setQuizTitle={setQuizTitle}
        setQuizDescription={setQuizDescription}
        setQuizDuration={setQuizDuration}
        setSelectedCategory={setSelectedCategory}
      />
      <SaveModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSubmit={saveQuiz}
      />
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
      />
    </>
  );
};

export default QuizCreator;
