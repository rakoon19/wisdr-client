import { getSession } from "@/actions/session";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
