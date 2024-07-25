'use client';

import React, { Suspense } from 'react';
import CourseQuizzesPage from './coursepage';

const CoursePage = () => (
  <Suspense>
    <CourseQuizzesPage />
  </Suspense>
);

export default CoursePage;
