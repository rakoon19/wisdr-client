import { serverAction } from "@/lib/serverAction";
import PromoteButton from "./PromoteButton";

const ManageUsersPage = async () => {
  const users = await serverAction("/dashboard/admin/manage-users");

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">
        Manage Users
      </h1>

      <div className="overflow-hidden border border-white">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="border-b border-white bg-zinc-900/60 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <th className="w-[25%] border-r border-white px-3 py-3">Name</th>
              <th className="w-[30%] border-r border-white px-3 py-3">Email</th>
              <th className="w-[15%] border-r border-white px-3 py-3">Role</th>
              <th className="w-[15%] border-r border-white px-3 py-3 text-center">
                Total Lessons
              </th>
              <th className="px-3 py-3">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/60">
            {users.map((user) => (
              <tr
                key={user._id}
                className="transition-colors hover:bg-zinc-900/40"
              >
                <td className="truncate border-r border-white/60 px-3 py-3 font-medium text-zinc-200">
                  {user.name}
                </td>

                <td className="truncate border-r border-white/60 px-3 py-3 text-zinc-400">
                  {user.email}
                </td>

                <td className="border-r border-white/60 px-3 py-3 capitalize">
                  <span className="rounded-full border border-blue-900/50 bg-blue-950/40 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
                    {user.role}
                  </span>
                </td>

                <td className="border-r border-white/60 px-3 py-3 text-center text-zinc-300">
                  {user.totalLessons}
                </td>

                <td className="px-3 py-3">
                  {user.role === "admin" ? (
                    <span className="font-semibold text-emerald-400">
                      Already Admin
                    </span>
                  ) : (
                    <PromoteButton id={user._id} currentRole={user.role} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsersPage;