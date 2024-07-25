// 'use client';
import React, { useState } from 'react';
import { UserAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
// nav ui
// import EditButton from '../nav_ui/EditButton';
import ProfileForm from '../nav_ui/ProfileForm';

export default function AuthorNavBar() {
  // open state for dropdown
  const [open, setOpen] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);

  // pull in user that is logged in
  const { user, userData, logout } = UserAuth();

  // handle user logout
  const handleLogout = async () => {
    try {
      setOpen(false);
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = async () => {
    setEdit(!edit);
  };

  // return render
  return (
    <header className="flex flex-row items-center justify-between bg-[#0E0D2D] px-14 py-3">
      <Link
        href={'/author/dashboard'}
        className=""
        aria-label="Navigate to the profile dashboard"
      >
        <Image width={96} height={48} src={'/GLXLogoWhite.png'} alt="GLXLogo" />
      </Link>

      <nav className="relative flex flex-row-reverse">
        <button className="rounded-full" onClick={() => setOpen(!open)}>
          <Image
            width={48}
            height={48}
            src={user.photoURL ? user.photoURL : `/userimagedefault.png`}
            className="rounded-full border-2 border-[#B4B3F4]"
            alt={`${user ? user.displayName : `profile pic`}`}
          />
        </button>
        {open && (
          <div className="absolute right-0 top-0 z-10 w-60 divide-y divide-[#A3A3A3] rounded border bg-[#ECECFC] p-3 transition delay-150 duration-1000 ease-in-out">
            <div className="flex flex-row items-center justify-between pb-2">
              <div className="flex flex-row items-center">
                <Image
                  width={48}
                  height={48}
                  src={user.photoURL ? user.photoURL : `/userimagedefault.png`}
                  alt={`${user ? user.displayName : `profile pic`}`}
                  className="rounded-full"
                />
                <div className="ps-1">
                  <p className="text-sm">{user.displayName}</p>
                  <p className="text-xs text-[#737373]">
                    {` `}
                    {/* {userData.job_title ? (
                      userData.job_title
                    ) : ( */}
                    {/* <EditButton
                      text="Edit Profile"
                      handleClick={handleEditClick}
                    /> */}
                    {/* // )} */}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1">
                <button
                  className="place-self-end"
                  onClick={() => setOpen(!open)}
                >
                  <i className="fa-regular fa-circle-xmark text-sx"></i>
                </button>
                <p className="text-xs text-[#737373]">
                  <i className="fa-regular fa-user pe-1 text-end text-xs"></i>
                  {userData.role}
                </p>
              </div>
            </div>
            {edit && <ProfileForm handleClose={handleEditClick} />}
            <div>
              <button
                className="mt-2 w-full rounded-md bg-[#4442E3] p-2 text-white"
                onClick={handleLogout}
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
