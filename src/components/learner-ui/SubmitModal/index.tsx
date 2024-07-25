import { FC, useState } from 'react';
import { MdMarkEmailRead } from 'react-icons/md';
import { Inter } from 'next/font/google';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const inter = Inter({
  subsets: ['latin'],
});

const SubmitModal: FC<SubmitModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [modalSubmitDisabled, setModalSubmitDisabled] = useState(false);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      <div className="z-10 h-[434px] w-[793px] transform overflow-hidden rounded-2xl bg-white px-36 py-14 shadow-xl transition-all">
        <div className="flex flex-col items-center">
          <div className="mb-4 text-6xl">
            <MdMarkEmailRead className="h-[72px] w-[110px] text-indigo-600" />
          </div>
          <h2
            className={`mb-6 self-stretch text-center text-2xl font-bold text-indigo-600 ${inter.className}`}
          >
            Submit Answers
          </h2>
          <p
            className={`mb-6 text-center text-base font-normal text-neutral-900 ${inter.className}`}
          >
            Once you submit your answers, you will not be able to make further
            changes. Are you sure you want to submit?
          </p>
          <div className="mt-4 flex h-[67px] justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className={`rounded-md border-2 border-indigo-400 bg-white px-4 py-2 text-indigo-400 hover:border-indigo-600 hover:text-indigo-600 ${inter.className} w-[152px] capitalize tracking-wide`}
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                setModalSubmitDisabled(true);
                onSubmit();
              }}
              disabled={modalSubmitDisabled}
              className={`rounded-md  bg-indigo-600 px-4 py-2 text-white ${inter.className} w-[152px] ${modalSubmitDisabled ? 'opacity-30' : ''}`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;
