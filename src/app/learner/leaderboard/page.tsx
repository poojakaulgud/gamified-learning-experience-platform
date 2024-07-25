'use client';
// bobbi was here on a coldbrew Saturday evening
import React, { useState, useEffect } from 'react';
import { UserAuth } from '@/context/AuthContext';
import { Card } from '@/components/dash_ui/Card';
import { CourseCardHeader } from '@/components/dash_ui/CourseCardHeader';
import { QuizCardHeader } from '@/components/dash_ui/QuizCardHeader';
import { CourseTable } from '@/components/dash_ui/CourseTable';
import { QuizTable } from '@/components/dash_ui/QuizTable';
import { FilterCheckBox } from '@/components/dash_ui/FilterCheckBox';
import FilterButton from '@/components/FilterButton';
import {
  getAllGeneralLeaderboardByUser,
  getCourses,
  // getLeaderboardByUserAndCourse,
  getAllLeaderboards,
  getQuizzesByCourse,
} from '@/services/leaderboardService';
import { fetchAllQuizResultsForUser } from '@/services/quizService';

import { ArrayItem } from '@/types/component/FilterButton';
import { Quizzes } from '@/types/component/Leaderbaord';
// import Modal from '@/components/Modal';

const DashboardPage = () => {
  const { userData } = UserAuth();

  // leaderboards by user
  const [userLeaderboards, setUserLeaderboards] = useState<ArrayItem[]>([]);
  // all courses
  const [courses, setCourses] = useState<ArrayItem[]>([]);
  const [userCourse, setUserCourse] = useState<string>('');
  // const [filteredCourses, setFilteredCourses] = useState([]);
  // const [leaderboards, setLeaderboards] = useState<ArrayItem[]>([]);
  // need current course id
  // const [currentCourse, setCurrentCourse] = useState<string>('');
  const [currentLeader, setCurrentLeader] = useState<ArrayItem>();
  const [currentQuizzes, setCurrentQuizzes] = useState<Quizzes[]>([]);
  const [currentQuizTotal, setCurrentQuizTotal] = useState<string>('');
  // for filtered leaderboards
  // const [filteredLeaders, setFilteredLeaders] = useState<ArrayItem[]>([]);
  const [filteredUserLeaders, setFilteredUserLeaders] = useState<ArrayItem[]>(
    []
  );

  useEffect(() => {
    const fetchCourses = async () => {
      const data = await getCourses();
      setCourses(data);
    };
    const fetchUserLeaderboards = async () => {
      const data = await getAllGeneralLeaderboardByUser(userData.uid);
      const courseData = await getCourses();
      const displayCourse = courseData.filter(
        (c: { title: any }) => c.title === data[0].course
      );

      setUserLeaderboards(data);
      setCurrentLeader(data[0]);
      setUserCourse(displayCourse[0].id ?? '');
    };
    // const fetchAllLeaderboards = async () => {
    //   const data = await getAllLeaderboards();
    //   console.log(data);
    //   setLeaderboards(data);
    //   setFilteredLeaders(data);
    //   console.log(leaderboards);
    //   console.log(filteredLeaders);
    // };

    fetchCourses();
    fetchUserLeaderboards();
    // fetchAllLeaderboards();
  }, [userData.uid]);

  const fetchQuizzes = async (courseId: string) => {
    try {
      const data = await getQuizzesByCourse(courseId);
      const userCourseData = await fetchAllQuizResultsForUser(userData.uid);
      // filter the array and the quiz name
      const usersTakenQuizzes = userCourseData.map(
        (ucd: { quiz_id: string }) => {
          let obj = {
            quiz_title: '',
          };
          for (let i = 0; i < data.length; i++) {
            const element = data[i];

            if (element.id === ucd.quiz_id) {
              obj = { ...ucd, quiz_title: element.quiz_title };
              break;
            }
          }
          if (!obj.quiz_title) {
            return false;
          } else {
            return obj;
          }
        }
      );
      setCurrentQuizzes(usersTakenQuizzes);
      setCurrentQuizTotal(`${usersTakenQuizzes.length}/${data.length}`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userCourse) {
      fetchQuizzes(userCourse);
    }
  }, [userCourse]);

  const handleFilterChange = (filteredArray: Array<any>) => {
    console.log(filteredUserLeaders);

    setFilteredUserLeaders(filteredArray);
  };

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // add functionality to filter courses here
    const { currentTarget } = e;

    const filtered = courses.filter(
      (item) => item.title === currentTarget.value
    );
    console.log(filtered);
  };
  // lupe started here
  const [boardByCourse, setboardByCourse] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCourses();
        const leaderboard = await getAllLeaderboards();
        const leaderWithCourseId = leaderboard.map((lb: { course?: any }) => {
          let obj = {};
          for (let i = 0; i < data.length; i++) {
            const element = data[i];

            if (element.title === lb.course) {
              obj = { ...lb, courseId: element.id };
              break;
            }
          }

          return obj;
        });

        setboardByCourse(leaderWithCourseId);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    }

    fetchData();
  }, []);

  const renderBoardByCourse = (boards: any) => (
      <>
        {boards.map((board: any, index: number) => (
          <>
            <Card
              key={index}
              classes="h-96 md:col-span-2 rounded-lg p-4 border min-w-96"
            >
              {' '}
              <CourseCardHeader
                title={board.course ? board.course : 'Title'}
                subtitle={`${board.users.length || 0} learner(s), ${board.quizId?.length || 0} quiz(zes)`}
                url={`/learner/course?courseId=${board.courseId}`}
              />
              <CourseTable users={board.users} />{' '}
            </Card>
          </>
        ))}
      </>
    );

  return (
    <main className="xs:px-6 xs:py-10 grid min-h-screen grid-cols-1 place-content-start gap-2 px-24 py-20 sm:px-12 sm:py-12 md:px-16 md:py-20 lg:px-24 lg:py-20 xl:px-28 xl:py-20">
      <section className="mb-12 grid grid-cols-1">
        <div className="mb-4 flex flex-row items-center justify-between">
          <h1 className="text-2xl font-semibold">My Leaderboards</h1>
          {/* course selection */}

          <FilterButton
            data={userLeaderboards}
            onFilterChange={handleFilterChange}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3">
          {/* add column grid here with two columns */}
          <Card classes={`h-96 md:col-span-2 rounded-lg p-4 border min-w-96`}>
            <CourseCardHeader
              title={currentLeader ? currentLeader?.course : 'Lets take a quiz'}
              subtitle={`${currentLeader?.users?.length ? currentLeader?.users?.length : 0} learner(s), ${currentLeader?.quizId?.length ? currentLeader?.quizId?.length : 0} quiz(zes)`}
              url={
                userCourse
                  ? `/learner/course?courseId=${userCourse}`
                  : `/learner/dashboard`
              }
            />
            {/* add table here */}
            {currentLeader?.users?.length ? (
              <CourseTable users={currentLeader?.users} />
            ) : (
              <div className="flex items-center justify-center text-center">
                <h2 className="text-center text-lg">{`Lets take a quiz.`}</h2>
              </div>
            )}
          </Card>
          {/* course and include quizzes - both using tables */}
          <Card classes={`h-96 rounded-lg p-4 border min-w-96`}>
            <QuizCardHeader
              title={`Course Quizzes`}
              subtitle={currentQuizTotal}
            />
            {currentQuizzes.length ? (
              <QuizTable quizzes={currentQuizzes} />
            ) : (
              <div className="text-center">
                <p>Loading</p>
              </div>
            )}
          </Card>
        </div>
      </section>
      <section className="grid grid-cols-1">
        {/* individual quizzes */}
        {/* div holds the dropdown filter for small screens */}
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold">Explore Leaderboards</h2>
        </div>
        {/* add filter and quiz leaderboards here */}
        {/* hide this on small screens  */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-5">
          <div>
            {/* filter goes here */}
            <h3 className="text-lg font-medium text-[#737373]">Filter</h3>
            <div className="p-2">
              {/* checkboxes go here */}
              {courses.map((course) => (
                <FilterCheckBox
                  name={course.title}
                  id={course.id}
                  key={course.id}
                  handleChange={handleCheckChange}
                />
              ))}
            </div>
          </div>
          {/* lupe started here */}
          <div className="md:col-span-4">
            {boardByCourse.length > 0 ? (
              renderBoardByCourse(boardByCourse)
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
