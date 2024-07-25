'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserAuth } from '@/context/AuthContext';
import { Card } from '@/components/dash_ui/Card';
import Image from 'next/image';

// login page
export default function Login() {
  // nextjs router
  const router = useRouter();
  // pull from UserAuth
  const { userData, googleSignIn, handleUserRole } = UserAuth();
  // state to save role based on user selection
  const [roleAdded, setRoleAdded] = useState<boolean>(false);

  // handle login function
  const handleLogin = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.error(error);
      // add toast here for error
    } finally {
      if (userData.role === 'Learner') {
        router.push('/learner/dashboard');
      } else {
        router.push('/author/dashboard');
      }
    }
  };

  const handleRoleAssignment = ({
    currentTarget,
  }: React.MouseEvent<HTMLButtonElement>) => {
    // change state values for adding to the database
    handleUserRole({ role: currentTarget.value });
    setRoleAdded(true);
  };

  return (
    <section className="grid h-screen grid-cols-1 gap-2 text-white md:grid-cols-2">
      <div className=" flex items-center bg-slate-950/75 p-10 sm:ps-12 md:ps-16">
        <div>
          <Image
            src={'/GLXLogoWhite.png'}
            alt="GLX Logo"
            width={150}
            height={75}
          />
          <h1 className="mt-10 text-3xl font-medium leading-10 md:text-5xl">
            Welcome to GLX
          </h1>

          <p className="mt-6">
            {!roleAdded
              ? `Please select your role to continue`
              : `Let's get started`}
          </p>
          <div className="mt-6 flex">
            {!roleAdded && (
              <Card classes="">
                <button
                  className="mr-2 mt-2 rounded-md bg-[#4442E3] p-2 text-sm text-white md:mr-4 md:mt-2 md:px-8 md:py-4 md:text-base"
                  value={'Learner'}
                  onClick={handleRoleAssignment}
                >
                  {`I'm A Learner`}
                </button>
                <button
                  className="mr-2 mt-2 rounded-md bg-[#4442E3] p-2 text-sm text-white md:mr-4 md:px-8 md:py-4 md:text-base"
                  value={'Author'}
                  onClick={handleRoleAssignment}
                >
                  {`I'm An Author`}
                </button>
              </Card>
            )}
            {roleAdded && (
              <Card classes="">
                <button
                  className="mr-2 rounded-md bg-[#4442E3] p-2 text-sm text-white md:mr-4 md:px-7 md:py-4 md:text-base"
                  onClick={handleLogin}
                >
                  SSO Login
                </button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
