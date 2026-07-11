import Image from "next/image";
import { getSession } from "@/actions/session";
import EditProfile from "./EditProfile";

// Helper to fetch database metadata on the server
async function getProfileData(email) {
  try {
    const res = await fetch(
      `http://localhost:5000/dashboard/profile?email=${encodeURIComponent(email)}`,
      { cache: "no-store" } // Ensure freshness
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching database profile:", error);
    return null;
  }
}

export default async function GeneralProfilePage() {
  // 1. Get the current active session on the server
  const sessionData = await getSession();

  if (!sessionData?.user?.email) {
    return (
      <div className="text-center py-20 text-gray-500">
        Please log in to view your profile.
      </div>
    );
  }

  // 2. Fetch the supplemental stats/lessons from your backend database
  const dbData = await getProfileData(sessionData.user.email);

  // Merge session fallback configurations if DB document isn't initialized yet
  const user = dbData?.user || sessionData.user;
  const totalLessons = dbData?.totalLessons || 0;
  const totalSaved = dbData?.totalSaved || 0;
  const publicLessons = dbData?.publicLessons || [];

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-black text-white">
      {/* Profile Header Card */}
      <div className="rounded-xl border p-6">
        <div className="flex items-center gap-6">
          <Image
            src={user.image || "/placeholder-avatar.png"} // safe avatar fallback
            alt={user.name || "User"}
            width={100}
            height={100}
            className="rounded-full object-cover h-[100px] w-[100px] border border-blue-500" 
          />
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Numerical Metrics Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold">{totalLessons}</p>
          <p className="text-sm text-gray-500">Lessons Created</p>
        </div>
        <div className="rounded-xl border p-4 text-center">
          <p className="text-2xl font-bold">{totalSaved}</p>
          <p className="text-sm text-gray-500">Saved Lessons</p>
        </div>
      </div>

      {/* Public Lessons Dynamic Block */}
      <div className="rounded-xl border p-6">
        <h2 className="text-xl font-semibold mb-3">Public Lessons</h2>
        {publicLessons.length === 0 ? (
          <p className="text-gray-500 text-sm">No public lessons yet.</p>
        ) : (
          <div className="space-y-3">
            {publicLessons.map((lesson) => (
              <div key={lesson._id} className="rounded-lg border p-4">
                <h3 className="font-medium">{lesson.title}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(lesson.createdDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Update Profile Form Client Wrapper */}
      <EditProfile user={user} />
    </div>
  );
}