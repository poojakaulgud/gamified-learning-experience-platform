import { FC } from 'react';
import { IoIosWarning } from 'react-icons/io';
import { Inter } from 'next/font/google';

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClick: () => void;
}

const inter = Inter({
  subsets: ['latin'],
});

const WarningModal: FC<WarningModalProps> = ({ isOpen, onClose, onClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      <div className="z-10 h-[434px] w-[793px] transform overflow-hidden rounded-2xl bg-white px-36 py-14 shadow-xl transition-all">
        <div className="flex flex-col items-center">
          <div className="mb-4 text-6xl">
            <IoIosWarning className="h-[72px] w-[110px] text-red-500" />
          </div>
          <h2
            className={`mb-6 self-stretch text-center text-2xl font-bold text-red-500 ${inter.className}`}
          >
            Warning!
          </h2>
          <p
            className={`mb-6 text-center text-base font-normal text-neutral-900 ${inter.className}`}
          >
            If you leave this page without submitting your answers, your work
            will not be saved. Are you sure you want to leave this page?
          </p>
          <div className="mt-4 flex h-[67px] justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className={`rounded-md border-2 border-red-400 bg-white px-4 py-2 text-red-400 hover:border-red-600 hover:text-red-600 ${inter.className} w-[152px] capitalize tracking-wide`}
            >
              No
            </button>
            <button
              type="button"
              onClick={onClick}
              className={`rounded-md bg-red-500 px-4 py-2 text-white  hover:bg-red-600 ${inter.className} w-[152px]`}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
