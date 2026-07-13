import { getSession } from "@/actions/session";
import { serverAction } from "@/lib/serverAction";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const dashboard = await serverAction(
    `/dashboard?email=${session.user.email}`
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {session.user.name}
          </h1>
          <p className="text-gray-500">
            Heres an overview of your activity.
          </p>
        </div>

        {session.user.role === "admin" && (
          <Link
            href="/dashboard/admin"
            className="inline-block rounded-lg bg-blue-500 text-white px-4 py-2 text-sm font-medium hover:bg-blue-200 transition-colors"
          >
            Go to Admin Panel
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-6">
          <p className="text-gray-500">Total Lessons</p>
          <h2 className="text-4xl font-bold">
            {dashboard.totalLessons}
          </h2>
        </div>

        <div className="rounded-xl border p-6">
          <p className="text-gray-500">Saved Lessons</p>
          <h2 className="text-4xl font-bold">
            {dashboard.totalSaved}
          </h2>
        </div>
      </div>

      {/* Recent Lessons */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Recently Added Lessons
        </h2>

        {dashboard.recentlyAdded.length === 0 ? (
          <p>No lessons created yet.</p>
        ) : (
          <div className="space-y-3">
            {dashboard.recentlyAdded.map((lesson) => (
              <div
                key={lesson._id}
                className="rounded-lg border p-4"
              >
                <h3 className="font-semibold">{lesson.title}</h3>

                <p className="text-sm text-gray-500">
                  {lesson.category} • {lesson.visibility}
                </p>

                <p className="mt-2 line-clamp-2">
                  {lesson.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analytics */}
      <div className="rounded-xl border p-6">
        <h2 className="text-xl font-semibold mb-4">
          Weekly Analytics
        </h2>

        <div className="h-64 flex items-center justify-center border border-dashed rounded-lg text-gray-400">
          Chart Coming Soon
        </div>
      </div>
    </div>
  );
}
