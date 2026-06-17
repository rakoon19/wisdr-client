import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";

export default function Home() {
  return (
    <div>
      Home
      <br></br>
      <Link href='/register'>register</Link>
      <br></br>
      <Link href='/login'>login</Link>

      <ToastContainer position="top-right" autoClose={4000} />
    </div>   
  );
}
