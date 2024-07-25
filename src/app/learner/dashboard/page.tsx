'use client';
import React, { useState, useEffect } from 'react';
import { UserAuth } from '@/context/AuthContext';
import PersonalMetrics from '@/components/Leaderboards/personal_metrics';
import MetricsBadges from '@/components/dash_ui/MetrisBadgesUI/MetricsBadgesLayout/MetricsBadges';
import ScrollToTopButton from '@/components/ScrollToTop';
import ExploreCourses from '@/components/dash_ui/ExploreCourses';
import FilterButton from '@/components/FilterButton';
import { ArrayItem } from '../../../types/component/FilterButton';
import { getPersonalMetricsById } from '@/services/leaderboardService';

const DashboardPage = () => {
  const { user } = UserAuth();
  const [leaderboards, setLeaderboards] = useState<ArrayItem[]>([]); // Specify type ArrayItem[]
  const [metrics, setMetrics] = useState({
    time_collected_sec: 0,
    time_collected_hours: 0,
    total_xp: 0,
    total_quizzes: 0,
    total_courses: 0,
  });
  const [filteredData, setFilteredData] = useState<ArrayItem[]>([]);
  const [result, setResult] = useState(0);

  const courseDummyData: ArrayItem[] = [
    {
      course: 'Java',
      title: 'Java Basics',
      description:
        'Comprehensive introduction to Java programming language covering syntax, object-oriented concepts, and application development fundamentals.',
      totalQuizzes: 3,
      totalHours: 8,
      courseId: 'R2amW00FArS0NjUPg7BD',
    },
    {
      course: 'Javascript',
      title: 'JavaScript Fundamentals',
      description:
        'Learn essential JavaScript concepts for web development, including DOM manipulation and asynchronous programming techniques.',
      totalQuizzes: 3,
      totalHours: 1,
      courseId: 'R7s7WSlAgCIHyFTPBNNj',
    },
    {
      course: 'Python',
      title: 'Python Data Analysis',
      description:
        'Explore data analysis using Python, focusing on libraries such as NumPy for numerical computations, Pandas for data manipulation, and Matplotlib for visualization.',
      totalQuizzes: 3,
      totalHours: 5,
      courseId: 'cx5I3wGyZqXYxrQSHqI5',
    },
    {
      course: 'Language Learning',
      title: 'Beginner Language Course',
      description:
        'Start learning a new language from scratch with emphasis on building vocabulary, understanding grammar, and basic conversational skills.',
      totalQuizzes: 2,
      totalHours: 6,
      courseId: 'pIed3Teac6h225kVgoI9',
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userUid = user.uid;
        if (userUid) {
          const leaderboard = await getPersonalMetricsById(userUid);
          setLeaderboards(leaderboard);
        }
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    if (user.uid) {
      fetchData();
    }
  }, [user.uid]);

  useEffect(() => {
    const updateMetrics = (data: ArrayItem[]) => {
      let totalXP = 0;
      let totalTime = 0;
      let totalQuizzes = 0;
      let uniqueCourses: string[] = [];
      console.log(data, 'data');
      data.forEach((item) => {
        if (item.user && item.course) {
          totalXP += item.user.xp;
          totalTime += item.user.time_taken;
          totalQuizzes++;

          // Check if the course is not already in uniqueCourses array before adding
          if (!uniqueCourses.includes(item.course)) {
            uniqueCourses.push(item.course);
          }
        }
      });

      const roundedUserData = Math.max(0, Math.round(totalTime / 3600));

      setMetrics({
        total_xp: totalXP,
        total_quizzes: totalQuizzes,
        time_collected_sec: totalTime,
        time_collected_hours: roundedUserData,
        total_courses: uniqueCourses.length,
      });
    };

    if (leaderboards.length > 0) {
      updateMetrics(leaderboards);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaderboards]);

  useEffect(() => {
    setFilteredData(courseDummyData);
  }, []);

  const handleFilterChange = (filteredArray: Array<any>) => {
    setResult(filteredArray.length);
    setFilteredData(filteredArray);
  };
  console.log(metrics, 'here');
  return (
    <main className="min-h-screen bg-gray-200">
      <div className="mx-2 p-2 md:mx-6 md:p-6">
        <h5 className="p-4 text-2xl md:p-6">
          <strong>Your Progress</strong>
        </h5>
        <section className="flex flex-col sm:flex-row">
          <div
            className="w-full p-2 sm:w-3/5 sm:pr-4 md:p-4 lg:w-4/5 lg:pr-0"
            style={{ maxHeight: '80vh', overflowY: 'auto' }}
          >
            <PersonalMetrics personalMetricsInfo={leaderboards} />
          </div>
          <div className="w-full sm:ml-0 sm:w-2/5 lg:w-1/5">
            <MetricsBadges metricsInfo={metrics} />
          </div>
        </section>
        <section>
          <div className="p-2 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-2xl">
                  <strong>Explore Courses</strong>
                </h5>
              </div>
              <div className="flex items-center justify-between">
                <FilterButton
                  data={courseDummyData}
                  onFilterChange={handleFilterChange}
                />
                <div
                  className="ml-2 text-sm md:ml-4"
                  style={{ color: '#737373' }}
                >
                  {result} results
                </div>
              </div>
            </div>
            <div>
              <ExploreCourses data={filteredData} />
            </div>
          </div>
        </section>
        <ScrollToTopButton />
      </div>
    </main>
  );
};

export default DashboardPage;