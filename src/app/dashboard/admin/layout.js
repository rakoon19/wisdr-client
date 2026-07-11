import { getSession } from "@/actions/session";
import { redirect } from "next/navigation";
import AppSideBar from "@/components/AppSideBar";

export default async function AdminLayout({ children }) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex">
      <AppSideBar />
      <main className="flex-1">{children}</main>
    </div>
  );
}