import React from 'react';
import { GoAlertFill } from 'react-icons/go';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      <div className="z-10 w-full max-w-md transform overflow-hidden rounded-lg bg-white p-8 shadow-xl transition-all">
        <div className="flex flex-col items-center">
          <div className="mb-4 text-6xl text-indigo-600">
            <GoAlertFill />
          </div>
          <h2 className="mb-6 text-center text-2xl font-semibold text-indigo-700">
            Oops! Check your quiz for errors
          </h2>
          <p className="mb-6 text-center text-black">
            We notice you may have not completed all the questions. Go back and
            check over your inputs and try again later.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-indigo-600 px-4 py-2 text-indigo-600 hover:bg-blue-100"
            >
              Back To Quiz Creation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
