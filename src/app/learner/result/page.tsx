'use client';

import React, { Suspense } from 'react';
import QuizResultsPage from './resultpage';

export default function ResultPage() {
  return (
    <Suspense>
      <QuizResultsPage />
    </Suspense>
  );
}
