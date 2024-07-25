/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { db } from '@/firebase/firebaseConfig';
import { getDocs, collection } from 'firebase/firestore';
import { FC } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>, metadata: any) => void;
  quizTitle: string;
  quizDescription: string;
  quizDuration: number | null;
  selectedCategory: string | null;
  setQuizTitle: (title: string) => void;
  setQuizDescription: (description: string) => void;
  setQuizDuration: (duration: number) => void;
  setSelectedCategory: (category: string | null) => void;
}

const SettingsModal: FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  quizTitle,
  quizDescription,
  quizDuration,
  selectedCategory,
  setQuizTitle,
  setQuizDescription,
  setQuizDuration,
  setSelectedCategory,
}) => {
  const [categories, setCategories] = useState<{ id: string; title: string }[]>(
    []
  );

  useEffect(() => {
    const fetchCategories = async () => {
      const querySnapshot = await getDocs(collection(db, 'courses'));
      const fetchedCategories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
      }));
      setCategories(fetchedCategories);
    };

    fetchCategories();
  }, []);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const metadata = {
      quiz_title: quizTitle,
      description: quizDescription,
      course: selectedCategory,
      est_time_to_complete: quizDuration,
    };
    onSubmit(event, metadata);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      <div className="z-10 w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-8 shadow-xl transition-all">
        <h2 className="mb-6 text-center text-3xl font-semibold text-indigo-700">
          Settings for your Quiz
        </h2>
        <p className="mb-6 text-center text-black">
          <strong>Before you publish</strong>, help others find your quiz by
          publishing it with the correct details to ensure your quiz is saved
          and categorized correctly.
        </p>
        <form onSubmit={handleFormSubmit}>
          {/* Quiz Title */}
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Quiz Title
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-black"
              placeholder="Insert your quiz title here"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
            />
            <span className="mt-1 text-xs text-gray-500">
              Insert your quiz title
            </span>
          </div>
          {/* Quiz Description */}
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Quiz Description
            </label>
            <textarea
              name="description"
              id="description"
              className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-black"
              placeholder="Provide a brief description of your quiz"
              value={quizDescription}
              onChange={(e) => setQuizDescription(e.target.value)}
            />
            <span className="mt-1 block text-xs text-gray-500">
              Provide a brief description of your quiz
            </span>
          </div>
          {/* Course Category */}
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Course Category
            </label>
            <div className="mt-2 rounded-lg border border-gray-300 p-4">
              <div className="flex flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={`mb-2 mr-2 rounded-md px-4 py-2 ${
                      selectedCategory === category.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.title}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-xs text-gray-500">
              Tag and search for a course category to add your quiz to
            </span>
          </div>
          {/* Estimated Quiz Duration */}
          <div className="mb-6">
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700"
            >
              Estimated Quiz Duration (in minutes)
            </label>
            <input
              type="number"
              name="duration"
              id="duration"
              className="mt-1 block w-full rounded-lg border border-gray-300 p-2 text-black shadow-sm sm:text-sm"
              placeholder="Provide an estimated duration of your quiz"
              value={quizDuration ?? 1}
              onChange={(e) => {
                const value = Math.max(Number(e.target.value), 1);
                setQuizDuration(value);
              }}
              min={1}
            />
          </div>
          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-indigo-600 px-4 py-2 text-indigo-600 hover:bg-indigo-100"
            >
              Back
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;
