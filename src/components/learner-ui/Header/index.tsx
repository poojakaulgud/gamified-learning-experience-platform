import React from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';

interface breadcrumbItem {
  label: string;
  href?: string;
}

interface HeaderProps {
  heading: string;
  items: breadcrumbItem[];
  backButtonClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ heading, items, backButtonClick }) => (
  <div className="mx-[6%]">
    <div className="mb-1 flex items-center">
      <button
        className="mr-[37px] transition-transform duration-100 ease-in-out active:scale-90"
        onClick={backButtonClick}
      >
        <IoIosArrowRoundBack className="h-[66px] w-[66px] text-indigo-600" />
      </button>

      <h1 className="text-3xl font-bold">{heading}</h1>
    </div>

    <nav aria-label="breadcrumb">
      <ol className="mb-[41px] ml-20 flex flex-wrap">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <a href={item.href}>
                <span className="text-neutral-500 hover:underline">
                  {item.label}
                </span>
              </a>
            ) : (
              <span className="text-neutral-500">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span className="mx-2 text-gray-400"> &gt; </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  </div>
);

export default Header;
