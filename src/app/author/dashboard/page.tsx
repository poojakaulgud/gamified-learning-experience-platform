'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { FaRocket } from 'react-icons/fa';
import { FaTrashAlt } from 'react-icons/fa';

import {
  collection,
  query,
  orderBy,
  getDocs,
  Timestamp,
  doc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import { UserAuth } from '@/context/AuthContext';

interface Quiz {
  id: string;
  quiz_title: string;
  is_created: Timestamp;
  course: string;
  courseTitle?: string;
  is_active: boolean;
  is_deleted: boolean;
}

const Dashboard: React.FC = () => {
  const { user } = UserAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeTab, setActiveTab] = useState<'published' | 'unpublished'>(
    'published'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const [confirmActionPopup, setConfirmActionPopup] = useState<{
    action: string;
    quizId: string;
  } | null>(null);
  const itemsPerPage = 5;
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const quizCollectionRef = collection(db, 'quiz');
      const q = query(quizCollectionRef, orderBy('created_at', 'desc'));

      try {
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot);
        const fetchedQuizzes: Quiz[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            quiz_title: data.quiz_title || 'No Title',
            is_created: data.created_at,
            course: data.course,
            is_active: data.is_active,
            is_deleted: data.is_deleted,
          };
        });

        const updatedQuizzes = await Promise.all(
          fetchedQuizzes.map(async (quiz) => {
            const courseDoc = await getDoc(doc(db, 'courses', quiz.course));
            return {
              ...quiz,
              courseTitle: courseDoc.exists()
                ? courseDoc.data().title
                : 'Unknown',
            };
          })
        );

        setQuizzes(updatedQuizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuVisible(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadQuizzes = () => {
    if (activeTab === 'published') {
      return quizzes.filter((quiz) => quiz.is_active && !quiz.is_deleted);
    } else {
      return quizzes.filter((quiz) => !quiz.is_active && !quiz.is_deleted);
    }
  };

  const displayedQuizzes = loadQuizzes().slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(loadQuizzes().length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const generatePageNumbers = (totalPages: number, currentPage: number) => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage > totalPages - 3) {
        pageNumbers.push(
          1,
          '...',
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pageNumbers.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        );
      }
    }
    return pageNumbers;
  };

  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  const handleTabClick = (tabName: 'unpublished' | 'published') => {
    setCurrentPage(1);
    setActiveTab(tabName);
  };

  const handleMenuClick = (quizId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuVisible(menuVisible === quizId ? null : quizId);
  };

  const handleMenuOptionClick = async (option: string, quizId: string) => {
    setMenuVisible(null);
    if (
      ['publish quiz', 'delete quiz', 'move to unpublished section'].includes(
        option
      )
    ) {
      setConfirmActionPopup({ action: option, quizId });
    } else if (option === 'edit quiz') {
      router.push(`/author/edit/${quizId}`);
    } else if (option === 'view metrics') {
      router.push(`/author/metrics/${quizId}`);
    } else if (option === 'open') {
      router.push(`/author/quiz/${quizId}`);
    } else {
      console.log(`${option} clicked for quiz ${quizId}`);
    }
  };

  const handleConfirmedAction = async (action: string, quizId: string) => {
    try {
      const quizRef = doc(db, 'quiz', quizId);
      if (action === 'publish quiz') {
        await updateDoc(quizRef, { is_active: true });
        setQuizzes((prevQuizzes) =>
          prevQuizzes.map((quiz) =>
            quiz.id === quizId ? { ...quiz, is_active: true } : quiz
          )
        );
      } else if (action === 'delete quiz') {
        await updateDoc(quizRef, { is_active: false, is_deleted: true });
        setQuizzes((prevQuizzes) =>
          prevQuizzes.filter((quiz) => quiz.id !== quizId)
        );
      } else if (action === 'move to unpublished section') {
        await updateDoc(quizRef, { is_active: false });
        setQuizzes((prevQuizzes) =>
          prevQuizzes.map((quiz) =>
            quiz.id === quizId ? { ...quiz, is_active: false } : quiz
          )
        );
      }
      setConfirmActionPopup(null);
    } catch (error) {
      console.error(`Error ${action}:`, error);
    }
  };

  return (
    <div className="font-inter relative min-h-[calc(100vh-64px)] bg-gray-100 text-base">
      <div className="mb-8 flex flex-col items-start justify-between px-4 pt-14 text-xl font-bold leading-normal text-black md:flex-row md:items-center md:px-[60px] md:text-2xl">
        <span className=" md:mb-0">{`Welcome back, ${user.displayName ? user.displayName : `Admin`}!`}</span>
        <Link href="/author/create">
          <button className="mt-7 h-8 w-full rounded-lg bg-[#4338CA] text-sm text-white shadow hover:bg-[#3730A3] md:mt-2 md:h-[47px] md:w-[180px]">
            Create A Quiz
          </button>
        </Link>
      </div>

      <div className="relative ml-5  p-6 md:w-auto md:px-12">
        <div className="mb-4 flex flex-wrap items-center">
          <div
            className={`cursor-pointer p-2 ${
              activeTab === 'published'
                ? 'border-b-2 border-[#4338CA] font-bold text-[#4338CA]'
                : 'text-gray-500 hover:border-b-2 hover:border-[#4338CA] hover:font-bold hover:text-[#4338CA]'
            }`}
            onClick={() => handleTabClick('published')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleTabClick('published')}
          >
            Published
          </div>
          <div
            className={`ml-4 cursor-pointer p-2 ${
              activeTab === 'unpublished'
                ? 'border-b-2 border-[#4338CA] font-bold text-[#4338CA]'
                : 'text-gray-500 hover:border-b-2 hover:border-[#4338CA] hover:font-bold hover:text-[#4338CA]'
            }`}
            onClick={() => handleTabClick('unpublished')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === 'Enter' && handleTabClick('unpublished')
            }
          >
            Unpublished
          </div>
        </div>
        <div className="max-h-[calc(100vh-250px)] min-h-[520px] overflow-x-auto rounded-lg bg-white p-4 shadow-md">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr className="border-b border-gray-200">
                <th className="p-4 text-left font-bold text-black">
                  Serial No
                </th>
                <th className="p-4 text-left font-bold text-black">
                  Quiz Name
                </th>
                <th className="p-4 text-left font-bold text-black">Date</th>
                <th className="p-4 text-left font-bold text-black">Category</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {displayedQuizzes.map((quiz, index) => (
                <tr
                  key={quiz.id}
                  className={`border-b border-gray-200 ${
                    menuVisible === quiz.id
                      ? 'bg-gray-100'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <td className="p-4 font-bold text-gray-900">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-4 text-gray-800">{quiz.quiz_title}</td>
                  <td className="p-4 text-gray-800">
                    {formatDate(quiz.is_created)}
                  </td>
                  <td className="p-4">
                    <span className="flex h-[30px] w-[169px] items-center justify-center rounded-[10px] border border-[#B4B3F4] bg-[#ECECFC] px-[10px] py-[5px] text-[16px] font-normal leading-normal text-black">
                      {quiz.courseTitle || 'Loading...'}
                    </span>
                  </td>

                  <td className="relative p-4 text-right">
                    <button
                      className={`relative rounded-full bg-transparent p-2 text-black ${menuVisible === quiz.id ? 'bg-[#B4B3F4]' : ''}`}
                      onClick={(e) => handleMenuClick(quiz.id, e)}
                    >
                      <HiOutlineDotsVertical />
                    </button>
                    {menuVisible === quiz.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                      >
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                        >
                          {activeTab === 'published' ? (
                            <>
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                role="menuitem"
                                onClick={() =>
                                  handleMenuOptionClick('open', quiz.id)
                                }
                              >
                                Open
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                role="menuitem"
                                onClick={() =>
                                  handleMenuOptionClick('view metrics', quiz.id)
                                }
                              >
                                View Metrics
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                role="menuitem"
                                onClick={() =>
                                  handleMenuOptionClick('delete quiz', quiz.id)
                                }
                              >
                                Delete Quiz
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                role="menuitem"
                                onClick={() =>
                                  handleMenuOptionClick('open', quiz.id)
                                }
                              >
                                Open
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                role="menuitem"
                                onClick={() =>
                                  handleMenuOptionClick('edit quiz', quiz.id)
                                }
                              >
                                Edit Quiz
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                role="menuitem"
                                onClick={() =>
                                  handleMenuOptionClick('publish quiz', quiz.id)
                                }
                              >
                                Publish Quiz
                              </button>
                              <button
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                role="menuitem"
                                onClick={() =>
                                  handleMenuOptionClick('delete quiz', quiz.id)
                                }
                              >
                                Delete Quiz
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-wrap justify-center py-4">
            <button
              className="mx-1 rounded bg-gray-200 px-2 py-1 text-sm text-gray-700 hover:bg-gray-300 md:text-base"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {generatePageNumbers(totalPages, currentPage).map((page, index) =>
              page === '...' ? (
                <span
                  key={index}
                  className="mx-1 rounded bg-gray-200 px-2 py-1 text-sm text-gray-700 md:text-base"
                >
                  ...
                </span>
              ) : (
                <button
                  key={index}
                  className={`mx-1 rounded px-2 py-1 text-sm md:text-base ${
                    currentPage === page
                      ? 'bg-[#4338CA] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => handlePageChange(page as number)}
                >
                  {page}
                </button>
              )
            )}
            <button
              className="mx-1 rounded bg-gray-200 px-2 py-1 text-sm text-gray-700 hover:bg-gray-300 md:text-base"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
      {confirmActionPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 text-black shadow-xl">
            <div className="mb-4 flex justify-center">
              {confirmActionPopup.action === 'delete quiz' ? (
                <FaTrashAlt className="text-5xl text-[#4B0082]" />
              ) : (
                <FaRocket className="text-5xl text-[#4B0082]" />
              )}
            </div>

            <h2 className="mb-4 text-center text-xl font-bold text-[#4B0082]">
              {confirmActionPopup.action === 'delete quiz'
                ? 'Delete Quiz'
                : 'Publish Quiz'}
            </h2>
            <p className="text-center text-[#4B0082]">
              {confirmActionPopup.action === 'delete quiz'
                ? 'You will not be able to recover this quiz. Are you sure you want to delete it?'
                : 'You will not be able to make further changes. Are you sure you are ready to publish your quiz?'}
            </p>
            <div className="mt-4 flex justify-center space-x-2">
              <button
                className="rounded border border-[#4B0082] bg-transparent px-4 py-2 text-[#4B0082] hover:bg-[#f0f0f0]"
                onClick={() => setConfirmActionPopup(null)}
              >
                Back
              </button>
              <button
                className="rounded bg-[#4B0082] px-4 py-2 text-white hover:bg-[#3A006D]"
                onClick={() =>
                  handleConfirmedAction(
                    confirmActionPopup.action,
                    confirmActionPopup.quizId
                  )
                }
              >
                {confirmActionPopup.action === 'delete quiz'
                  ? 'Delete'
                  : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
