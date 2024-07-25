import React from 'react';
import { useRouter } from 'next/navigation';

interface BreadcrumbProps {
  quizTitle: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ quizTitle }) => {
  const router = useRouter();

  const handleDashboardClick = () => {
    router.push('/author/dashboard');
  };

  return (
    <nav className="mb-4 mt-4 px-4 text-gray-700 md:px-8 lg:px-16 xl:px-24">
      <ol className="flex items-center space-x-2">
        <li>
          <button
            onClick={handleDashboardClick}
            className="text-black hover:text-blue-600"
          >
            Dashboard
          </button>
        </li>
        <li>{'>'}</li>
        <li className="text-black">Create Quiz</li>
        <li>{'>'}</li>
        <li className="font-bold">{quizTitle || 'Untitled Quiz'}</li>
      </ol>
    </nav>
  );
};

export default Breadcrumb;
