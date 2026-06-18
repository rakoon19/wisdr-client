import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import { getSession } from '@/actions/session';

export default async function Home() {
  const session = await getSession();
  console.log(session);
  
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Home</h1>
      
      <div className="mt-6 flex flex-col gap-2">
        <Link href='/register' className="text-primary hover:underline w-fit">
          Register
        </Link>
        <Link href='/login' className="text-primary hover:underline w-fit">
          Login
        </Link>
      </div>

      {session?.session?.token && (
        <div className="mt-6 p-4 rounded-medium bg-default-100 max-w-md break-all">
          <p className="text-xs text-default-500 font-semibold mb-1">Session Token Active:</p>
          <code className="text-xs">{session.session.token}</code>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={4000} />
    </div>   
  );
}