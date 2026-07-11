import { getSession } from "@/actions/session";
import { serverMutation } from "@/lib/serverMutation";
import { redirect } from "next/navigation";

const SuccessPage = async () => {
  const session = await getSession();

  if (!session?.user?.email) {
    redirect("/login");
  }
  
  await serverMutation(
    "/pricing/success",
    {
      email: session.user.email,
    },
    "PATCH"
  );

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-xl border p-8 text-center shadow">
        <h1 className="text-3xl font-bold text-green-600">
          Payment Successful 🎉
        </h1>

        <p className="mt-3 text-gray-600">
          Your subscription has been activated.
        </p>
      </div>
    </div>
  );
};

export default SuccessPage;