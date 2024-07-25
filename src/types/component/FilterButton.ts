import { ReactNode } from 'react';

export type Course = {
  // category: string;
  // // Add other properties as needed
  // name: string;
  // quizNum: number;
  // totalTime: number;
  // description: string;

  courseId: string;
  description: string;
  totalQuizzes: number;
  totalHours: number;
  title: string;
  id: string;
  quizId: string[];
  course: string;
  user: {
    badges_earned: number;

    user_uid: string;
    totalXP: number;
    completion_time_sec: number;
    total_quizzes: number;
    xp: number;
    time_taken: number;
  };
  quizTitle: string[];
};

export type UnknownObject = {
  // category: string;
  courseId: string;
  description: string;
  totalQuizzes: number;
  totalHours: number;
  title: string;
  id: string;
  quizId: string[];
  course: string;
  user: {
    badges_earned: number;

    user_uid: string;
    totalXP: number;
    completion_time_sec: number;
    total_quizzes: number;
    xp: number;
    time_taken: number;
  };
  users: {
    badges_earned: number;

    user_uid: string;
    totalXP: number;
    completion_time_sec: number;
    total_quizzes: number;
    xp: number;
    time_taken: number;
  }[];
  quizTitle: string[];
  [key: string]: ReactNode | {}; // Define other potential properties with any type
};

export type ArrayItem = Partial<Course & UnknownObject>;
