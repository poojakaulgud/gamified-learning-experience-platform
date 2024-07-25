import React from 'react';

const Loading: React.FC = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="relative">
      <div className="h-24 w-24 rounded-full border-b-8 border-t-8 border-gray-200"></div>
      <div className="absolute left-0 top-0 h-24 w-24 animate-spin rounded-full border-b-8 border-t-8 border-indigo-500 "></div>
    </div>
  </div>
);

export default Loading;
