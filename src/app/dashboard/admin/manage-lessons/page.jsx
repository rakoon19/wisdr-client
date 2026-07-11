import { serverAction } from "@/lib/serverAction";
import DeleteLessonButton from "./DeleteLessonButton";
import FeatureButton from "./FeatureButton";
import ReviewButton from "./ReviewButton";

const ManageLessonsPage = async ({ searchParams }) => {
  const params = await searchParams;
  const query = new URLSearchParams(params);

  const data = await serverAction(
    `/dashboard/admin/manage-lessons?${query.toString()}`
  );

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">
        Manage Lessons
      </h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white bg-zinc-900/50 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Public Lessons
          </h2>
          <p className="mt-2 text-3xl font-bold text-white">
            {data.publicLessonsCount}
          </p>
        </div>

        <div className="rounded-2xl border border-white bg-zinc-900/50 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Private Lessons
          </h2>
          <p className="mt-2 text-3xl font-bold text-white">
            {data.privateLessonsCount}
          </p>
        </div>

        <div className="rounded-2xl border border-red-400 bg-red-950/20 p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-red-400/80">
            Reported
          </h2>
          <p className="mt-2 text-3xl font-bold text-red-400">
            {data.flaggedLessonsCount}
          </p>
        </div>
      </div>

      <div className="overflow-hidden border border-white">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="border-b border-white bg-zinc-900/60 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <th className="w-[28%] border-r border-white px-3 py-3">Title</th>
              <th className="hidden w-[16%] border-r border-white px-3 py-3 md:table-cell">Creator</th>
              <th className="hidden w-[14%] border-r border-white px-3 py-3 lg:table-cell">Category</th>
              <th className="hidden w-[12%] border-r border-white px-3 py-3 sm:table-cell">Visibility</th>
              <th className="w-[10%] border-r border-white px-2 py-3 text-center">Feat.</th>
              <th className="w-[10%] border-r border-white px-2 py-3 text-center">Rev.</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/60">
            {data.lessons.map((lesson) => (
              <tr
                key={lesson._id}
                className="transition-colors hover:bg-zinc-900/40"
              >
                <td className="truncate border-r border-white/60 px-3 py-3 font-medium text-zinc-200">
                  {lesson.title}
                </td>

                <td className="hidden truncate border-r border-white/60 px-3 py-3 text-zinc-400 md:table-cell">
                  {lesson.creatorName}
                </td>

                <td className="hidden truncate border-r border-white/60 px-3 py-3 lg:table-cell">
                  <span className="inline-block max-w-full truncate rounded-full border border-blue-900/50 bg-blue-950/40 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
                    {lesson.category}
                  </span>
                </td>

                <td className="hidden truncate border-r border-white/60 px-3 py-3 text-zinc-400 sm:table-cell">
                  {lesson.visibility}
                </td>

                <td className="border-r border-white/60 px-2 py-3 text-center">
                  {lesson.featured ? "✅" : "❌"}
                </td>

                <td className="border-r border-white/60 px-2 py-3 text-center">
                  {lesson.reviewed ? "✅" : "❌"}
                </td>

                <td className="px-3 py-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <FeatureButton lesson={lesson} />
                    <ReviewButton lesson={lesson} />
                    <DeleteLessonButton id={lesson._id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageLessonsPage;