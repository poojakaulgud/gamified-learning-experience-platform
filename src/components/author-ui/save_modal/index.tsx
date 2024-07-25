import { FC } from 'react';
import { FaSave } from 'react-icons/fa';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const SaveModal: FC<SaveModalProps> = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      <div className="z-10 w-full max-w-md transform overflow-hidden rounded-lg bg-white p-8 shadow-xl transition-all">
        <div className="flex flex-col items-center">
          <div className="mb-4 text-6xl text-indigo-600">
            <FaSave />
          </div>
          <h2 className="mb-6 text-center text-2xl font-semibold text-indigo-700">
            Save Quiz
          </h2>
          <p className="mb-6 text-center text-black">
            Once you save your quiz, you will be able to make further changes
            until you are ready to publish. Your saved quiz will be in the
            Unpublished section. Are you sure you are ready to save your quiz?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-indigo-600 px-4 py-2 text-indigo-600 hover:bg-blue-100"
            >
              Back
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;
