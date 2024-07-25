const FUNCTIONS_URL = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL;
export const getAllGeneralLeaderboardByUser = async (userId: string) => {
  const encodedUserId = encodeURIComponent(userId);
  const url = `${FUNCTIONS_URL}/getAllGeneralLeaderboardByUser?user_uid=${encodedUserId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to get Leaderboard data');
  }
  return response.json();
};

export const getCourses = async () => {
  const url = `${FUNCTIONS_URL}/getAllCourses`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to get course data');
  }
  return response.json();
};

export const getPersonalMetricsById = async (userUid: string) => {
  const encodedUserId = encodeURIComponent(userUid);
  const url = `${FUNCTIONS_URL}/getPersonalMetricsById?userUid=${encodedUserId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to get personal metris data');
  }
  return response.json();
};

export const getQuizzesByCourse = async (courseId: string) => {
  const encodedCourseId = encodeURIComponent(courseId);
  const url = `${FUNCTIONS_URL}/getQuizzesByCourse?courseId=${encodedCourseId}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch quizzes');
  }
  return response.json();
};

export const getLeaderboardByUserAndCourse = async (
  course: string,
  uid: string
) => {
  const encodedCourse = encodeURIComponent(course);
  const encodedUid = encodeURIComponent(uid);
  const url = `${FUNCTIONS_URL}/getLeaderboardByUserAndCourse?course=${encodedCourse}&user_uid=${encodedUid}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard');
  }
  return response.json();
};
// leaderboard

export const getAllLeaderboards = async () => {
  const url = `${FUNCTIONS_URL}/getAllLeaderboards`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard');
  }
  return response.json();
};
