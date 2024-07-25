const FUNCTIONS_URL = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL;

type quizResultData = {
  user_uid: string | undefined;
  quiz_id: string | null;
  answers: {
    [question_id: string]: {
      is_correct: boolean;
      question_text: string;
      user_choice: number;
    };
  };
  scored_points: number;
  time_taken: number;
  completed_at: any;
  percentage: number;
  total_points: number;
  xp: number;
};

export const fetchCourseTitle = async (courseId: string) => {
  const encodedCourseId = encodeURIComponent(courseId);
  const url = `${FUNCTIONS_URL}/getCourseTitle?courseId=${encodedCourseId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch course title');
  }
  return response.json();
};

export const fetchQuizzesByCourse = async (courseId: string) => {
  const encodedCourseId = encodeURIComponent(courseId);
  const url = `${FUNCTIONS_URL}/getQuizzesByCourse?courseId=${encodedCourseId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch quizzes');
  }
  return response.json();
};

export const fetchAllQuizResultsForUser = async (userId: string) => {
  const encodedUserId = encodeURIComponent(userId);
  const url = `${FUNCTIONS_URL}/getAllQuizResultsfForUser?userId=${encodedUserId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch user quiz results');
  }
  return response.json();
};

export const fetchQuizResultForUser = async (
  userId: string,
  quizId: string
) => {
  const encodedUserId = encodeURIComponent(userId);
  const encodedQuizId = encodeURIComponent(quizId);
  const url = `${FUNCTIONS_URL}/getQuizResultForUser?userId=${encodedUserId}&quizId=${encodedQuizId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch quiz result');
  }
  return response.json();
};

export const fetchQuizById = async (quizId: string) => {
  const encodedQuizId = encodeURIComponent(quizId);
  const url = `${FUNCTIONS_URL}/getQuizById?quizId=${encodedQuizId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch quizzes');
  }
  return response.json();
};

export const fetchAddingQuizResult = async (data: quizResultData) => {
  const response = await fetch(`${FUNCTIONS_URL}/addQuizResult`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to add quiz result');
  }
  return response.json();
};
