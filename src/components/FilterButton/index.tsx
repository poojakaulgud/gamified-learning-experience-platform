import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import {
  ArrayItem,
  Course,
  UnknownObject,
} from '../../types/component/FilterButton';
import { getCourses } from '@/services/leaderboardService';

interface FilterButtonProps {
  data: ArrayItem[];
  // eslint-disable-next-line no-unused-vars
  onFilterChange: (filteredArray: ArrayItem[]) => void;
}
interface optionList {
  value: string;
  label: string;
}
const FilterButton: React.FC<FilterButtonProps> = ({
  data,
  onFilterChange,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [filteredArray, setFilteredItems] = useState<ArrayItem[]>(data);
  const [optionList, setOptionList] = useState<optionList[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch leaderboard data based on user uid
        const courses = await getCourses();
        const list = courses.map((item: Partial<Course & UnknownObject>) => {
          if (item && item.title) {
            return {
              value: item.title,
              label: item.title,
            };
          } else {
            return { value: 'invalid', label: 'Invalid Item' }; // Example of handling invalid items
          }
        });

        setOptionList(list);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };
    fetchData();
  }, []);

  const optionsList = [
    {
      value: ' ',
      label: 'Select Course',
    },
    { value: 'All', label: 'All' },

    ...optionList,
  ];

  const [option, setOption] = useState<optionList | null>(null);
  const handleFilterChange = (selectedOption: optionList | null) => {
    setOption(selectedOption);
    console.log(selectedOption, 'options');
    if (!selectedOption || selectedOption.value === 'All') {
      setFilteredItems(data);
      onFilterChange(data);
    } else {
      const category = selectedOption.value;
      const filtered = data.filter((item) => item.course === category);
      console.log(filtered); // Assuming item.title matches the course title
      setFilteredItems(filtered);
      onFilterChange(filtered);
    }
  };

  return (
    <div className="relative inline-block w-48 text-left">
      <Select
        value={option}
        options={optionsList}
        onChange={handleFilterChange}
        isClearable={false}
      />
    </div>
  );
};

export default FilterButton;

// lupe's note: I couldnt get the color to change and didnt have time to research further. below is utilizing dropdown from flowbite. same functionality

// import React, { useState } from 'react';
// import { Dropdown } from 'flowbite-react';
// import { ArrayItem } from '../../types/component/FilterButton';

// interface FilterButtonProps {
//   data: ArrayItem[];
//   // eslint-disable-next-line no-unused-vars
//   onFilterChange: (filteredArray: ArrayItem[]) => void; // Callback function to pass filtered array to parent
// }

// const FilterButton: React.FC<FilterButtonProps> = ({
//   data,
//   onFilterChange,
// }) => {
//   const [items] = useState<ArrayItem[]>(data); // State to hold the array of items
//   const [filteredArray, setFilteredItems] = useState<ArrayItem[]>(data); // State to hold filtered array

//   // future revision will make call from db
//   const dummyData: ArrayItem[] = [
//     { category: 'Java' },
//     { category: 'Javascript' },
//     { category: 'Python' },
//     { category: 'Language Learning' },
//   ];

//   // Function to filter items based on category
//   const filterByCategory = (category: string) => {
//     const filtered = items.filter((item) => {
//       if (category === 'all') {
//         return true; // Return all items if category is 'all'
//       } else {
//         return item.category === category;
//       }
//     });
//     setFilteredItems(filtered); // Update filteredItems state with filtered array
//     onFilterChange(filtered); // Pass filtered array to parent component
//   };

//   // Function to handle filter change based on dropdown selection
//   const handleFilterChange = (category: string) => {
//     filterByCategory(category);
//   };
//   // view filtered info on console
//   console.log('inside button component:', filteredArray);
//   return (
//     <div>
//       <Dropdown
//         label={
//           <span>
//             <>
//               <i className="fa-solid fa-clipboard"></i> Select Course
//             </>
//           </span>
//         }
//         dismissOnClick={true}
//         placement="right"
//       >
//         <Dropdown.Item onClick={() => handleFilterChange('all')}>
//           All
//         </Dropdown.Item>
//         {dummyData.map((item, index) => (
//           <Dropdown.Item
//             key={index}
//             onClick={() => handleFilterChange(item.category)}
//           >
//             {item.category}
//           </Dropdown.Item>
//         ))}
//       </Dropdown>
//     </div>
//   );
// };

// export default FilterButton;
