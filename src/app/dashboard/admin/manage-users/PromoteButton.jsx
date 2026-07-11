"use client";

import { useRouter } from "next/navigation";

export default function PromoteButton({ id }) {
  const router = useRouter();

  const promote = async () => {
    await fetch(
      `http://localhost:5000/dashboard/admin/manage-users/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "admin",
        }),
      }
    );

    router.refresh();
  };

  return (
    <button
      onClick={promote}
      className="rounded bg-blue-600 px-3 py-1 text-white"
    >
      Promote
    </button>
  );
}