import Image from "next/image";
import { redirect } from "next/navigation";
import { getSession } from "@/actions/session";
import { serverAction } from "@/lib/serverAction";

const AdminPage = async () => {
  const sessionData = await getSession();

  // Not logged in
  if (!sessionData?.user) {
    redirect("/login");
  }

  // RBAC: Only admins can access
  if (sessionData.user.role !== "admin") {
    redirect("/");
    // or redirect("/403")
  }

  const adminHome = await serverAction("/dashboard/admin");

  return (
    <div className="space-y-6 p-6">
      <div>
        <p>Total Users: {adminHome.userCount}</p>
        <p>Total Public Lessons: {adminHome.publicLessonCount}</p>
        <p>Total Reported/Flagged Lessons: {adminHome.reportCount}</p>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Most Active Contributors
        </h2>

        <div className="space-y-3">
          {adminHome.contributors?.map((person, index) => (
            <div
              key={person.creatorEmail}
              className="flex items-center gap-4 rounded-lg border p-3"
            >
              <p className="w-6 font-bold">#{index + 1}</p>

              <Image
                src={person.creatorImage}
                alt={person.creatorName}
                width={50}
                height={50}
                className="rounded-full"
              />

              <div className="flex-1">
                <h3 className="font-semibold">{person.creatorName}</h3>
                <p className="text-sm text-gray-500">
                  {person.creatorEmail}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold">{person.totalLessons}</p>
                <p className="text-sm text-gray-500">
                  Lesson{person.totalLessons > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">
          Todays New Lessons
        </h2>

        <div className="space-y-3">
          {adminHome.todayNewLessons?.length > 0 ? (
            adminHome.todayNewLessons.map((lesson) => (
              <div
                key={lesson._id}
                className="flex items-start gap-4 rounded-lg border p-4"
              >
                <Image
                  src={lesson.creatorImage}
                  alt={lesson.creatorName}
                  width={50}
                  height={50}
                  className="rounded-full"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{lesson.title}</h3>

                  <p className="text-sm text-gray-500">
                    By {lesson.creatorName} ({lesson.creatorEmail})
                  </p>

                  <p className="mt-2 text-sm">{lesson.description}</p>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded bg-gray-100 px-2 py-1">
                      {lesson.category}
                    </span>

                    <span className="rounded bg-gray-100 px-2 py-1">
                      {lesson.emotionalTone}
                    </span>

                    <span className="rounded bg-gray-100 px-2 py-1">
                      {lesson.visibility}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-gray-500">
                    Created: {new Date(lesson.createdDate).toLocaleString()}
                  </p>
                </div>

                <div className="space-y-1 text-right text-sm">
                  <p>❤️ {lesson.likesCount}</p>
                  <p>👁️ {lesson.viewsCount}</p>
                  <p>⭐ {lesson.favoritesCount}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No new lessons today.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;