import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import Dash_Card from '../dash_ui/MetrisBadgesUI/DashCard';
import { ArrayItem } from '@/types/component/FilterButton';

type PersonalMetricsProps = {
  personalMetricsInfo: ArrayItem[];
};

const PersonalMetrics = ({ personalMetricsInfo }: PersonalMetricsProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart<'bubble'> | null>(null);

  // useEffect(() => {
  //   const processedData = personalMetricsInfo.map((data) => {
  //     if (!data.user) {
  //       return;
  //     } else {
  //       let quizCounter = 0;
  //       const hours = data.user.time_taken / 3600;
  //       return {
  //         course: data.course,
  //         totalXP: data.user.xp,
  //         total_quizzes: quizCounter++,
  //         completion_time_hours: hours < 1 ? 0 : Math.floor(hours), // Convert seconds to hours and round down
  //       };
  //     }
  //   });
  //   console.log(processedData, 'data');

  //   setChartData(processedData);
  // }, [personalMetricsInfo]);

  useEffect(() => {
    // Initialize an object to store aggregated metrics by course
    const aggregatedData: Record<
      string,
      {
        totalXP: number;
        totalQuizzes: number;
        totalHours: number;
        quizzes: { quizTitle: string; xp: number; timeTakenSeconds: number }[];
      }
    > = {};

    // Iterate through each item in personalMetricsInfo
    personalMetricsInfo.forEach((data) => {
      if (!data.user || !data.course || typeof data.quiz_title !== 'string') {
        return; // Skip if data is incomplete or quiz_title is not a string
      }

      // Extract relevant data
      const { course, user, quiz_title } = data;
      const xp = user.xp || 0;
      const timeTakenSeconds = user.time_taken || 0;
      const hoursSpent = timeTakenSeconds / 3600;
      const quizTitle: string = quiz_title; // Ensure quizTitle is a string

      // If course already exists in aggregatedData, update its values
      if (aggregatedData[course]) {
        aggregatedData[course].totalXP += xp;
        aggregatedData[course].totalQuizzes++;
        aggregatedData[course].totalHours += hoursSpent;
        aggregatedData[course].quizzes.push({
          quizTitle,
          xp,
          timeTakenSeconds,
        });
      } else {
        // If course does not exist, initialize its values
        aggregatedData[course] = {
          totalXP: xp,
          totalQuizzes: 1,
          totalHours: hoursSpent,
          quizzes: [{ quizTitle, xp, timeTakenSeconds }], // Store quiz details for reference
        };
      }
    });

    // Convert aggregatedData object into an array of objects for charting
    const processedData = Object.keys(aggregatedData).map((course) => ({
      course,
      totalXP: aggregatedData[course].totalXP,
      total_quizzes: aggregatedData[course].totalQuizzes,
      completion_time_hours: Math.floor(aggregatedData[course].totalHours),
    }));

    console.log(processedData); // Check processed data in console

    // Set the processed data to state for rendering
    setChartData(processedData);
  }, [personalMetricsInfo]);

  useEffect(() => {
    if (!chartRef.current || chartData.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const myChartRef = chartRef.current.getContext('2d');
    if (myChartRef) {
      chartInstance.current = new Chart(myChartRef, {
        type: 'bubble',
        data: {
          datasets: chartData.map((data, index) => ({
            label: `${data.course} | ${data.totalXP} Experience Points (XP) | ${data.total_quizzes} Quizzes | ${data.completion_time_hours} Hours spent`,
            backgroundColor:
              index % 2 === 0 ? 'rgba(68, 66, 227)' : 'rgba(239, 68, 68)',
            data: [
              {
                x: data.completion_time_hours, // Use hours for the x-axis
                y: data.total_quizzes,
                r: Math.sqrt(data.totalXP) * 5,
              },
            ],
          })),
        },
        options: {
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => tooltipItem.dataset.label || '',
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'linear',
              position: 'bottom',
              title: {
                display: true,
                text: 'Time Spent on quizzes (hours)',
                color: 'black',
                font: { size: 14 },
              },
            },
            y: {
              title: {
                display: true,
                text: '# of Quizzes Taken',
                color: 'black',
                font: { size: 14 },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <Dash_Card classes="">
      <div>
        <canvas
          className="bg-white"
          ref={chartRef}
          style={{ width: '100%', height: '450px' }}
        ></canvas>
      </div>
    </Dash_Card>
  );
};

export default PersonalMetrics;
