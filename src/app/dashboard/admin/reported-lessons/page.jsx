import { serverAction } from "@/lib/serverAction";
import ReportModal from "./ReportModal";
import DeleteLessonButton from "../manage-lessons/DeleteLessonButton";
import IgnoreButton from "./IgnoreButton";

const ReportedLessonsPage = async () => {
  const reports = await serverAction("/dashboard/admin/reported-lessons");

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">
        Reported Lessons
      </h1>

      <div className="mb-6 rounded-2xl border border-red-900/40 bg-red-950/20 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-red-400/80">
          Total Reported
        </h2>
        <p className="mt-2 text-3xl font-bold text-red-400">
          {reports.length}
        </p>
      </div>

      <div className="overflow-hidden border border-white">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="border-b border-white bg-zinc-900/60 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <th className="w-[35%] border-r border-white px-3 py-3">Lesson</th>
              <th className="w-[15%] border-r border-white px-3 py-3 text-center">Reports</th>
              <th className="w-[25%] border-r border-white px-3 py-3">Reasons</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/60">
            {reports.map((item) => (
              <tr
                key={item.lessonId}
                className="transition-colors hover:bg-zinc-900/40"
              >
                <td className="truncate border-r border-white/60 px-3 py-3 font-medium text-zinc-200">
                  {item.lessonTitle}
                </td>

                <td className="border-r border-white/60 px-3 py-3 text-center">
                  <span className="inline-flex items-center justify-center rounded-full border border-red-900/50 bg-red-950/40 px-2.5 py-0.5 text-xs font-semibold text-red-400">
                    {item.reportCount}
                  </span>
                </td>

                <td className="border-r border-white/60 px-3 py-3">
                  <ReportModal reports={item.reports} />
                </td>

                <td className="px-3 py-3">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <DeleteLessonButton id={item.lessonId} />
                    <IgnoreButton id={item.lessonId} />
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

export default ReportedLessonsPage;