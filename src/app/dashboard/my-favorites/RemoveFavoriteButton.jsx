"use client";

import { useRouter } from "next/navigation";

export default function RemoveFavoriteButton({ id, email }) {
  const router = useRouter();

  const handleRemove = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/my-favorites/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    router.refresh();
  };

  return (
    <button
      onClick={handleRemove}
      className="rounded bg-red-600 px-3 py-1 text-white"
    >
      Remove
    </button>
  );
}