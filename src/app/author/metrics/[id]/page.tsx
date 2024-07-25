/* eslint-disable no-unused-vars */
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { db } from '@/firebase/firebaseConfig';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
  ChartOptions,
} from 'chart.js';
import moment from 'moment';
import { ChartData, ChartType } from 'chart.js';
import { Timestamp } from 'firebase/firestore';

import {
  getDoc,
  doc,
  query,
  collection,
  where,
  QuerySnapshot,
  DocumentData,
  getDocs,
} from 'firebase/firestore';
import 'chartjs-adapter-date-fns';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
);

interface Question {
  question_text: string;
  correct_option: number;
  options: string[];
  points: number;
  question_format: string;
}

interface Questions {
  [key: number]: Question;
}

interface Quiz {
  [key: string]: any;
  id: string;
  lastEdited_at: { seconds: number; nanoseconds: number };
  course: string;
  description: string;
  edited_by: string;
  est_time_to_complete: number;
  is_active: boolean;
  created_by: string;
  created_at: { seconds: number; nanoseconds: number };
  questions: Questions;
  total_points: number;
  published_by: string;
  quiz_title: string;
  published_at: { seconds: number; nanoseconds: number };
  is_deleted: boolean;
}

const chart_options: ChartOptions<'line'> = {
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day',
      },
      title: {
        display: true,
        text: 'Date',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      ticks: {
        font: {
          size: 14,
          weight: 'bold',
        },
      },
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        font: {
          size: 14,
          weight: 'bold',
        },
      },
      title: {
        display: true,
        text: 'Responses',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      grid: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  elements: {
    point: {
      radius: 5,
      hoverRadius: 8,
    },
  },
  maintainAspectRatio: false,
};

const App: React.FC = () => {
  const { id: quizId } = useParams();
  const router = useRouter();
  const chartRef = useRef<ChartJS | null>(null);

  const groupTimestamps = (
    timestamps: string[],
    interval: 'week' | 'month' | 'day'
  ): { [key: string]: number } => {
    const counts: { [key: string]: number } = {};

    timestamps.forEach((timestamp) => {
      if (timestamp) {
        const date = new Date(timestamp);

        const key = moment(date).startOf(interval).format('YYYY-MM-DD');
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    return counts;
  };

  const prepareChartData = (groupedData: { [key: string]: number }): {} => {
    const labels = Object.keys(groupedData).sort();
    const data = labels.map((label) => groupedData[label]);

    return {
      labels,
      datasets: [
        {
          label: 'Number of Responses',
          data,
          fill: true,
          backgroundColor: 'rgba(236, 236, 252, 1)',
          borderColor: 'rgba(180, 179, 244, 1)',
          tension: 0.4,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#dad9f9',
          pointHoverBackgroundColor: '#dad9f9',
          pointHoverBorderColor: '#fff',
        },
      ],
    };
  };

  interface QuizAnswer {
    is_correct: boolean;
    question_text: string;
    selected_choice: string;
  }

  interface QuizResult {
    answers: { [key: string]: QuizAnswer }; // Using an index signature
    completed_at: string;
    percentage: number;
    quiz_id: string;
    scored_points: number;
    total_points: number;
    user_uid: string;
    xp: number;
  }

  const initialQuizResult: QuizResult = {
    answers: {
      '0': {
        is_correct: false,
        question_text: '',
        selected_choice: '',
      },
    },
    completed_at: '',
    quiz_id: '',
    percentage: 0,
    scored_points: 0,
    total_points: 0,
    user_uid: '',
    xp: 0,
  };

  const initialQuestion: Question = {
    question_text: '',
    correct_option: 0,
    options: [],
    points: 0,
    question_format: '',
  };

  interface WrongQuestion {
    options: String[];
    question_text: string;
    correct_option: number;
  }
  const initialWrongQuestion: WrongQuestion = {
    options: [],
    question_text: '',
    correct_option: 0,
  };

  const initialQuiz: Quiz = {
    id: '',
    lastEdited_at: { seconds: 0, nanoseconds: 0 },
    course: '',
    description: '',
    edited_by: '',
    est_time_to_complete: 0,
    is_active: false,
    created_by: '',
    created_at: { seconds: 0, nanoseconds: 0 },
    questions: {
      0: initialQuestion,
    },
    total_points: 0,
    published_by: '',
    quiz_title: '',
    published_at: { seconds: 0, nanoseconds: 0 },
    is_deleted: false,
  };

  const [title, setTitle] = useState<string>('');
  // const [id, setId] = useState<string>('');
  // const [description, setDescription] = useState<string>('');
  const [questions, setQuestions] = useState<any[]>([]);
  // const [formats, setFormats] = useState<string[]>([]);
  const [quizData, setQuizData] = useState<Quiz>(initialQuiz);
  const [selectedOption, setSelectedOption] = useState('');
  const [quizResults, setQuizResults] = useState<QuizResult[]>([
    initialQuizResult,
  ]);
  const [response_count, setResponseCount] = useState<number>(0);
  const [highestScore, setHighestScore] = useState<number>(0);
  const [lowestScore, setLowestScore] = useState<number>(0);
  const [wrongAttemptCount, setWrongAttemptCount] = useState<number>(0);

  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  const [wrongQuestion, setWrongQuestion] =
    useState<WrongQuestion>(initialWrongQuestion);

  const handleChange = (value: React.SetStateAction<string>) => {
    setSelectedOption(value);
  };

  useEffect(() => {
    if (quizId && typeof quizId === 'string') {
      fetchData(quizId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function fetchData(id: string) {
    const collectionName = 'quiz';

    try {
      const document = await getDocumentById(collectionName, id);
      const quiz = document;
      setQuizData(quiz);

      fetchQuizResultsData(id, quiz);
      setTitle(quiz.quiz_title);
      setQuestions(Object.values(quiz.questions));
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  }

  async function fetchQuizResultsData(id: string, quizData: any) {
    try {
      const results = await getQuizResultsByQuizId(id);
      if (results) {
        setQuizResults(results);
        // console.log('my_quiz_results', results);
        processQuizResults(results, quizData);
      } else {
        console.log('No results found.');
        setQuizResults([]);
      }
      // console.log('set_quiz_results', quizResults);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  }

  const processQuizResults = (results: QuizResult[], quizData: any) => {
    const totalResponses = results.length;
    setResponseCount(totalResponses);
    let high = 0;
    let low = results[0] ? results[0].scored_points : 0;
    const incorrectCounts: { [key: string]: number } = {};
    let timestamps: any = [];
    // console.log(typeof results[0].completed_at);
    results.forEach(
      (result: {
        answers: Object;
        scored_points: number;
        completed_at: Object;
      }) => {
        timestamps.push(result.completed_at);
        if (result.scored_points > high) {
          high = result.scored_points;
          setHighestScore(high);
        }
        if (result.scored_points < low) {
          low = result.scored_points;
          setLowestScore(low);
        }
        if (typeof result.answers === 'object' && result.answers !== null) {
          Object.entries(result.answers).forEach(([key, answer]) => {
            if (!answer.is_correct) {
              if (incorrectCounts[key]) {
                incorrectCounts[key] += 1;
              } else {
                incorrectCounts[key] = 1;
              }
            }
          });
        } else {
          console.error('Answers is not an object for result:', result);
        }
      }
    );

    let mostIncorrectAnswerIndex: string | null = null;
    let maxCount = 0;

    Object.entries(incorrectCounts).forEach(([index, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostIncorrectAnswerIndex = index;
      }
    });
    setWrongAttemptCount(maxCount);
    // console.log(mostIncorrectAnswerIndex);
    // console.log(quizData.questions);
    // console.log(timestamps);
    const groupedData = groupTimestamps(timestamps, 'day');
    // console.log(groupedData);
    const preparedData = prepareChartData(groupedData);
    // console.log(preparedData);
    setChartData(preparedData);
    const wrong_question: any = Object.entries(quizData.questions).find(
      ([key, val]) => key === mostIncorrectAnswerIndex
    )?.[1];
    // console.log(wrong_question);
    let wrongQuestionObject: WrongQuestion = {
      options: [],
      question_text: '',
      correct_option: 0,
    };
    wrongQuestionObject.question_text = wrong_question.question_text;
    let new_options: String[] = [];
    Object.entries(wrong_question.options).forEach(([key, value]) => {
      new_options.push(String(value));
    });
    wrongQuestionObject.options = new_options;
    wrongQuestionObject.correct_option = wrong_question.correct_option;
    // console.log(wrongQuestionObject);
    setWrongQuestion(wrongQuestionObject);
  };

  const getQuizResultsByQuizId = async (
    quizId: string
  ): Promise<QuizResult[] | null> => {
    const quizResultCollection = collection(db, 'quiz_result');
    const q = query(quizResultCollection, where('quiz_id', '==', quizId));

    try {
      const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);

      if (querySnapshot.empty) {
        console.log('No matching documents.');
        return null;
      }

      const results: QuizResult[] = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as unknown as QuizResult);
      });

      return results;
    } catch (error) {
      console.error('Error fetching quiz results: ', error);
      return null;
    }
  };

  async function getDocumentById(
    collectionName: string,
    docId: string
  ): Promise<any | null> {
    const docRef = doc(db, collectionName, docId);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      return { id: docSnapshot.id, ...docSnapshot.data() };
    } else {
      console.log('No document with the given ID found in the collection.');
      return null;
    }
  }

  function handleBack(): void {
    router.push('/author/dashboard');
  }

  return (
    <div>
      <div className="min-h-screen bg-neutral-100 p-10">
        <div className="mx-10 mb-6 h-6 ">
          <span className="text-base font-normal text-black">
            Dashboard &gt; {title} &gt;{' '}
          </span>
          <span className="text-base font-bold text-black">Metrics</span>
        </div>
        <div className="mx-10 mb-6 inline-flex h-7 w-7 ">
          <span>
            <button onClick={handleBack}>
              <i className="fa-solid fa-arrow-left text-xl text-black"></i>
            </button>
          </span>
          <span className=" mx-5 text-xl font-bold  text-indigo-600">
            Metrics
          </span>
        </div>

        <div className="rounded-lg bg-neutral-50 p-5 shadow-md sm:mx-10">
          <div className="grid  grid-cols-1 gap-10 px-10 pt-10 sm:grid-cols-3">
            <div className=" flex flex-col rounded-lg bg-white p-4 shadow">
              <h2 className="text-xl font-medium text-gray-700">
                No. of Responses
              </h2>
              <p className="mt-10 text-5xl font-bold text-indigo-600 sm:text-5xl">
                {response_count}
              </p>
            </div>
            <div className="flex flex-col rounded-lg bg-white p-4 shadow">
              <h2 className="text-xl font-medium text-gray-700">
                Highest Score
              </h2>
              <p className="mt-10 text-5xl font-bold text-indigo-600 sm:text-5xl">
                {highestScore}
              </p>
            </div>
            <div className="flex flex-col rounded-lg bg-white p-4 shadow">
              <h2 className="text-xl font-medium text-gray-700">
                Lowest Score
              </h2>
              <p className="mt-10 text-5xl font-bold text-indigo-600 sm:text-5xl">
                {lowestScore}
              </p>
            </div>
          </div>

          <div className="my-10 rounded-lg  bg-white p-5 shadow-md sm:mx-10">
            <h2 className="my-5 mb-5 text-xl font-semibold text-gray-700">
              Responses Graph
            </h2>
            <div className="mx-2 mt-2 h-96">
              <Line
                className="min-h-56 2xs:min-h-32"
                data={chartData}
                options={chart_options}
              />
            </div>
          </div>

          <div className="my-10 rounded-lg  bg-white p-5 shadow-md sm:mx-10">
            <h2 className="my-5 text-xl font-semibold text-gray-700">
              Questions that have been answered wrongly
            </h2>
            <div className="flex flex-row gap-5">
              <div className="flex w-full flex-row  gap-10 rounded-lg bg-white px-5 py-8 shadow-md sm:w-1/2">
                <div className="flex w-full flex-col gap-8">
                  <div className="w-full font-sans text-sm font-bold text-neutral-900">
                    {wrongQuestion.question_text}
                  </div>
                  <div className="flex flex-col gap-2">
                    {Object.entries(wrongQuestion.options).map(
                      ([key, option_text], index) => (
                        <div key={index}>
                          <div
                            className={`${index === wrongQuestion.correct_option ? 'rounded-md border-2 border-green-600' : ''} flex items-center justify-between rounded-md bg-neutral-100 px-4 py-2`}
                          >
                            <label
                              className={` flex w-full cursor-pointer items-center justify-between border-green-700 font-sans text-base font-normal text-neutral-500`}
                            >
                              <span>{option_text}</span>
                              <input
                                type="radio"
                                name="quizOption"
                                value={index}
                                checked={index === wrongQuestion.correct_option}
                                onChange={() => {}}
                                className="form-radio h-6 w-6 text-green-700"
                                style={{
                                  color: '#15803d',
                                  accentColor: '#15803d',
                                }}
                              />
                            </label>
                          </div>

                          {index === wrongQuestion.correct_option && (
                            <div className="mt-1 text-sm font-bold text-green-600">
                              Correct Answer
                            </div>
                          )}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-row  gap-10  px-2  sm:w-1/2">
                <div className="mr-10 flex w-full flex-col gap-8">
                  <h6 className="my-5 mr-10 font-semibold text-gray-700 sm:text-base">
                    Number of wrong responses:
                  </h6>
                  <p className="mr-10 text-3xl font-bold text-indigo-600 sm:text-3xl md:text-5xl">
                    {wrongAttemptCount}/{response_count}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
