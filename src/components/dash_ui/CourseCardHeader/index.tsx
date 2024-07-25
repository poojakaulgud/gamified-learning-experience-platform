// import { ReactNode } from 'react';
import Link from 'next/link';

// create reusable card header
export function CourseCardHeader({
  title,
  subtitle,
  url,
}: {
  title?: string;
  subtitle: string;
  url: string;
}) {
  return (
    <div className="mb-3 flex flex-row items-center justify-between">
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-xs font-medium text-[#4442E3]">{subtitle}</p>
      </div>
      <div className="flex flex-row items-center justify-end">
        <Link
          href={url}
          className="rounded-md bg-[#4442E3] px-8 py-4 text-white xs:px-2 xs:py-2 xs:text-xs sm:px-4 sm:py-2 sm:text-sm md:px-6 md:py-4 md:text-base"
        >
          See Quizzes
        </Link>
        <i className="fa-solid fa-up-right-and-down-left-from-center ms-8 text-xl"></i>
      </div>
    </div>
  );
}
