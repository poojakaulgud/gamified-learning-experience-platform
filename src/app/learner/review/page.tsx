'use client';

import React, { Suspense } from 'react';
import ReviewAnswers from './reviewpage';

const ReviewPage = () => (
  <Suspense>
    <ReviewAnswers />
  </Suspense>
);

export default ReviewPage;
