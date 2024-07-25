import { Metadata } from 'next';
import { ToastContainer } from 'react-toastify';
// import Image from 'next/image';
import Login from '@/components/dash_ui/Login';

export const metadata: Metadata = {
  title: 'GLX Quiz App Login',
  description: 'Login into the GLX Quiz App to get started.',
};

export default function Home() {
  return (
    <main
      className="bg-cover bg-fixed bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/splashpageimg.png')` }}
    >
      <ToastContainer />
      <Login />
    </main>
  );
}
