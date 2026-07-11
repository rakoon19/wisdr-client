"use client";

import { useRouter } from "next/navigation";

export default function IgnoreButton({ id }) {
  const router = useRouter();

  const handleIgnore = async () => {
    if (!confirm("Clear all reports for this lesson?")) return;

    await fetch(
      `http://localhost:5000/dashboard/admin/reported-lessons/${id}/ignore`,
      {
        method: "DELETE",
      }
    );

    router.refresh();
  };

  return (
    <button className="rounded bg-green-600 px-3 py-1 text-white" onClick={handleIgnore}>
      Ignore
    </button>
  );
}