import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Tooltip } from 'flowbite-react';

type ProgressBarProps = {
  user_data_complete: number;
  Title: string;
  Description: string | JSX.Element;
  BadgeActive: string;
  BadgeInactive: string;
  goalValue: number;
};

type Levels = {
  current_goal_level: number;
  user_level: number;
  current_user_data: number;
};

const MetricDetails: React.FC<ProgressBarProps> = ({
  user_data_complete,
  Title,
  Description,
  BadgeActive,
  BadgeInactive,
  goalValue,
}) => {
  const [levels, setLevels] = useState<Levels>({
    current_goal_level: goalValue,
    user_level: 0,
    current_user_data: user_data_complete,
  });
  const [Badge, setBadge] = useState<string>(BadgeInactive);

  useEffect(() => {
    if (user_data_complete >= levels.current_goal_level) {
      const new_current_goal = levels.current_goal_level + goalValue;
      const new_user_level = levels.user_level + 1;
      const new_current_user_data =
        user_data_complete - levels.current_goal_level;

      setLevels((prevLevels) => ({
        ...prevLevels,
        current_goal_level: new_current_goal,
        user_level: new_user_level,
        current_user_data: new_current_user_data,
      }));

      setBadge(BadgeActive);
    } else {
      setLevels((prevLevels) => ({
        ...prevLevels,
        current_goal_level: goalValue,
        user_level: 0,
        current_user_data: user_data_complete,
      }));
    }
  }, [user_data_complete]);

  const progress = (levels.current_user_data / levels.current_goal_level) * 100;

  return (
    <div className="mb-6 flex flex-col">
      <div className="flex items-center">
        <h1
          className="mr-2"
          style={{ color: '#737373', fontSize: '14px', fontWeight: 700 }}
        >
          {Title}
        </h1>
        <div className="relative flex-shrink-0">
          <Tooltip
            className="absolute right-0 top-0 w-40 font-thin"
            content={Description}
          >
            <Image
              src="/Information Icon.png"
              alt="Icon"
              width={20}
              height={20}
              className="cursor-pointer"
            />
          </Tooltip>
        </div>
      </div>
      <div className="flex items-center">
        <div
          className="progressbar"
          style={{
            width: '100%',
            height: '20px',
            backgroundColor: '#f0f0f0',
            borderRadius: '20px',
            overflow: 'hidden',
          }}
        >
          <span
            className="filled"
            style={{
              display: 'block',
              height: '100%',
              backgroundColor: '#4442E3',
              width: `${progress}%`,
              transition: 'width 0.3s ease-in-out',
            }}
          ></span>
        </div>
        <div className="relative ml-2 h-12 w-12 flex-shrink-0">
          <Image src={Badge} alt="Badge" width={48} height={48} />
        </div>
      </div>
      <div className="flex items-center">
        <div style={{ fontSize: '12px', color: '#737373' }}>
          <p>
            <strong className="text-base">{levels.current_user_data}</strong>/{' '}
            {goalValue} completed
          </p>
        </div>
        <div style={{ fontSize: '12px', color: '#737373', marginLeft: 'auto' }}>
          Level {levels.user_level}
        </div>
      </div>
    </div>
  );
};

export default MetricDetails;
