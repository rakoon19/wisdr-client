import { getSession } from "@/actions/session";
import { redirect } from "next/navigation";
import AppSideBar from "@/components/AppSideBar";

export default async function DashboardLayout({ children }) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex">
      <AppSideBar role={session.user.role} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
