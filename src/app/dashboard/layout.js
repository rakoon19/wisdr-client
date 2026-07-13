import { getSession } from "@/actions/session";
import { redirect } from "next/navigation";
import UserSideBar from "@/components/UserSideBar";

export default async function DashboardLayout({ children }) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex bg-black text-white">
       <UserSideBar />
      <main className="flex-1 p-5 bg-black">
        {children}
      </main>
    </div>
  );
}
