import Link from "next/link";
import { getSession } from "@/actions/session";
import { serverAction } from "@/lib/serverAction";
import RemoveFavoriteButton from "./RemoveFavoriteButton";

const MyFavoritesPage = async ({ searchParams }) => {
  const session = await getSession();
  const params = await searchParams;

  const category = params?.category || "";
  const emotionalTone = params?.emotionalTone || "";

  const query = new URLSearchParams({
    email: session.user.email,
  });

  if (category) query.append("category", category);
  if (emotionalTone) query.append("emotionalTone", emotionalTone);

  const favorites = await serverAction(
    `/dashboard/my-favorites?${query.toString()}`
  );

  return (
    <div className="min-h-screen space-y-6 bg-black p-6 text-white">
      <h1 className="text-3xl font-bold tracking-tight">My Favorites</h1>

      {/* Filters */}
      <form className="flex flex-wrap gap-3">
        <select
          name="category"
          defaultValue={category}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-200"
        >
          <option value="">All Categories</option>
          <option>Personal Growth</option>
          <option>Career</option>
          <option>Relationships</option>
          <option>Mindset</option>
          <option>Mistakes Learned</option>
        </select>

        <select
          name="emotionalTone"
          defaultValue={emotionalTone}
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-200"
        >
          <option value="">All Tones</option>
          <option>Motivational</option>
          <option>Sad</option>
          <option>Realization</option>
          <option>Gratitude</option>
        </select>

        <button className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition-colors hover:bg-blue-500">
          Filter
        </button>
      </form>

      <div className="overflow-hidden border border-white">
        <table className="w-full table-fixed border-collapse text-sm">
          <thead>
            <tr className="border-b border-white bg-zinc-900/60 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <th className="w-[25%] border-r border-white px-3 py-3">Title</th>
              <th className="hidden w-[15%] border-r border-white px-3 py-3 md:table-cell">Category</th>
              <th className="hidden w-[15%] border-r border-white px-3 py-3 lg:table-cell">Tone</th>
              <th className="hidden w-[13%] border-r border-white px-3 py-3 sm:table-cell">Visibility</th>
              <th className="hidden w-[12%] border-r border-white px-3 py-3 md:table-cell">Created</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/60">
            {favorites.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-zinc-400">
                  No favorite lessons found.
                </td>
              </tr>
            ) : (
              favorites.map((lesson) => (
                <tr
                  key={lesson._id}
                  className="transition-colors hover:bg-zinc-900/40"
                >
                  <td className="truncate border-r border-white/60 px-3 py-3 font-medium text-zinc-200">
                    {lesson.title}
                  </td>

                  <td className="hidden truncate border-r border-white/60 px-3 py-3 md:table-cell">
                    <span className="rounded-full border border-blue-900/50 bg-blue-950/40 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
                      {lesson.category}
                    </span>
                  </td>

                  <td className="hidden truncate border-r border-white/60 px-3 py-3 text-zinc-400 lg:table-cell">
                    {lesson.emotionalTone}
                  </td>

                  <td className="hidden truncate border-r border-white/60 px-3 py-3 text-zinc-400 sm:table-cell">
                    {lesson.visibility}
                  </td>

                  <td className="hidden truncate border-r border-white/60 px-3 py-3 text-zinc-400 md:table-cell">
                    {new Date(lesson.createdDate).toLocaleDateString()}
                  </td>

                  <td className="px-3 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/public/${lesson._id}`}
                        className="rounded-lg bg-blue-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-blue-500"
                      >
                        Details
                      </Link>

                      <RemoveFavoriteButton
                        id={lesson._id}
                        email={session.user.email}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyFavoritesPage;