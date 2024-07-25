// import { ReactNode } from 'react';

// create paper card that will accept children
export function QuizCardHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-3 flex flex-row items-center">
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-xs font-medium text-[#4442E3]">
          {subtitle} completed
        </p>
      </div>
    </div>
  );
}
