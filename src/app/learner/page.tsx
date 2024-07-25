import Link from 'next/link';
export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="text-5xl">Oops, this page has moved</h1>
      <p className="mt-3">{`Let's get you back to the Dashboard.`}</p>
      <Link
        href={'/learner/dashboard'}
        className="mt-4 rounded-md bg-[#4442E3] p-2 text-sm text-white md:mr-4 md:px-7 md:py-4 md:text-base"
      >
        Back To Dashboard
      </Link>
    </main>
  );
}
