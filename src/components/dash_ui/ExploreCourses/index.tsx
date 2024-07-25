import Dash_Card from '../MetrisBadgesUI/DashCard';
import { ArrayItem } from '../../../types/component/FilterButton';
import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
// import { fetchQuizzesByCourse } from '@/services/leaderboardService';

interface ExploreCoursesProps {
  data: ArrayItem[];
}

const ExploreCourses: React.FC<ExploreCoursesProps> = ({ data }) => {
  const router = useRouter();

  const handleGoToQuizzes = (courseId: ReactNode) => {
    router.push(`/learner/course?courseId=${courseId}`);
  };

  return (
    <div className="my-8 mb-56">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
        {data &&
          data.map((item) => (
            <Dash_Card key={item.courseId} classes="course card w-full">
              <div className="p-6">
                <div className="text-lg">
                  <strong style={{ fontWeight: 'bold', fontSize: '24px' }}>
                    {item.course}
                  </strong>
                </div>

                <div
                  className="mt-3 flex items-center gap-3 text-xs"
                  style={{ color: 'slategray' }}
                >
                  <div>
                    <strong style={{ fontWeight: 'bold', fontSize: '12px' }}>
                      {item.totalQuizzes} quizzes,
                    </strong>
                  </div>
                  <div>
                    {' '}
                    <strong style={{ fontWeight: 'bold', fontSize: '12px' }}>
                      {item.totalHours} hours
                    </strong>
                  </div>
                </div>
                <div className="mb-3 mt-6 flex flex-col items-center justify-center">
                  <div className="text-center">{item.description}</div>{' '}
                </div>
                <div className="mt-6">
                  <button
                    aria-label="see quizzes"
                    className="btn btn-primary rounded-lg px-4 py-2 text-sm text-white"
                    style={{ backgroundColor: '#4442E3' }}
                    onClick={() => handleGoToQuizzes(item.courseId)} // Pass courseId to handleGoToQuizzes
                  >
                    <span>
                      See Quizzes <i className="fa-solid fa-chevron-right"></i>
                    </span>
                  </button>
                </div>
              </div>
            </Dash_Card>
          ))}
      </div>
    </div>
  );
};

export default ExploreCourses;
