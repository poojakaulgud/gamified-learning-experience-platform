import React from 'react';
import FilterButton from '../FilterButton';
import { ArrayItem } from '../../types/component/FilterButton';

const SampleParent: React.FC = () => {
  const dummyData: ArrayItem[] = [
    {
      category: 'Java',
      name: 'Java Programming',
      quizNum: 2,
      totalTime: 2,
      description: 'words',
    },
    {
      category: 'Javascript',
      name: 'Javascript Development',
      quizNum: 2,
      totalTime: 2,
      description: 'words',
    },
    {
      category: 'Python',
      name: 'Python Programming',
      quizNum: 2,
      totalTime: 2,
      description: 'words',
    },
    {
      category: 'Language Learning',
      name: 'Language Learning Basics',
      quizNum: 2,
      totalTime: 2,
      description: 'words',
    },
  ];

  const handleFilterChange = (filteredArray: Array<any>) => {
    console.log(filteredArray, 'parent side');
  };

  return (
    <React.Fragment>
      <FilterButton data={dummyData} onFilterChange={handleFilterChange} />
    </React.Fragment>
  );
};

export default SampleParent;
