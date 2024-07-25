import React, { useState, useEffect } from 'react';
import Dash_Card from '../../DashCard';
import MetricDetails from '../../MetricDetails';

type data = {
  userData: number;
  Title: string;
  Description: string | JSX.Element;
  BadgeActive: string;
  BadgeInactive: string;
  goalValue: number;
};

type metricsProp = {
  metricsInfo: {
    time_collected_sec: number;
    time_collected_hours: number;
    total_xp: number;
    total_quizzes: number;
    total_courses: number;
  };
};

function MetricsBadges({ metricsInfo }: metricsProp) {
  const [quizzesData, setQuizzesData] = useState<data>({
    userData: metricsInfo.total_quizzes,
    Title: 'Quizzes',
    Description: (
      <span>
        This is a <strong>quiz</strong> milestone. Take more{' '}
        <strong>quizzes</strong> across <strong>any courses</strong> to earn
        your next badge!
      </span>
    ),
    BadgeActive: '/Quiz_Badge_Active.png',
    BadgeInactive: '/Quiz_Badge_InActive.png',
    goalValue: 10,
  });
  const [coursesData, setCoursesData] = useState<data>({
    userData: metricsInfo.total_courses,
    Title: 'Courses',
    Description: (
      <span>
        This is a <strong>course</strong> milestone. Take more{' '}
        <strong>courses</strong> across <strong>any quiz</strong> to earn your
        next badge!
      </span>
    ),
    BadgeActive: '/Course_Badge_Active.png',
    BadgeInactive: '/Course_Badge_Inactive.png',
    goalValue: 5,
  });
  const [hoursData, setHoursData] = useState<data>({
    userData: metricsInfo.time_collected_hours,
    Title: 'Hours Spent',
    Description: (
      <span>
        This is a <strong>hourly</strong> milestone. Spend more{' '}
        <strong>hours</strong> across <strong>any quiz</strong> to earn your
        next badge!
      </span>
    ),
    BadgeActive: '/Time_Badge_Active.png',
    BadgeInactive: '/Time_Badge_Inactive.png',
    goalValue: 6,
  });

  useEffect(() => {
    setQuizzesData((prevData) => ({
      ...prevData,
      userData: metricsInfo.total_quizzes,
    }));
    setCoursesData((prevData) => ({
      ...prevData,
      userData: metricsInfo.total_courses,
    }));
    setHoursData((prevData) => ({
      ...prevData,
      userData: metricsInfo.time_collected_hours,
    }));
  }, [metricsInfo]);

  return (
    <React.Fragment>
      <div className="p-4">
        <Dash_Card classes="my-custom-card">
          <h2 className="text-16 font-weight-700 mb-4 font-sans font-bold text-black">
            Metrics & Badges
          </h2>
          <MetricDetails
            user_data_complete={quizzesData.userData}
            Title={quizzesData.Title}
            Description={quizzesData.Description}
            BadgeActive={quizzesData.BadgeActive}
            BadgeInactive={quizzesData.BadgeInactive}
            goalValue={quizzesData.goalValue}
          />
          <MetricDetails
            user_data_complete={coursesData.userData}
            Title={coursesData.Title}
            Description={coursesData.Description}
            BadgeActive={coursesData.BadgeActive}
            BadgeInactive={quizzesData.BadgeInactive}
            goalValue={coursesData.goalValue}
          />
          <MetricDetails
            user_data_complete={hoursData.userData}
            Title={hoursData.Title}
            Description={hoursData.Description}
            BadgeActive={hoursData.BadgeActive}
            BadgeInactive={quizzesData.BadgeInactive}
            goalValue={hoursData.goalValue}
          />
        </Dash_Card>
      </div>
    </React.Fragment>
  );
}

export default MetricsBadges;
