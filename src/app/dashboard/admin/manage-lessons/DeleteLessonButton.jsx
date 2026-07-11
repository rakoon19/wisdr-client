"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteLessonButton({ id }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);

    try {
      await fetch(
        `http://localhost:5000/dashboard/admin/manage-lessons/${id}`,
        {
          method: "DELETE",
        }
      );

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
      >
        Delete
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-xl font-semibold">Delete Lesson</h2>

            <p className="mt-3 text-gray-600">
              Are you sure you want to delete this lesson?
            </p>

            <p className="mt-1 text-sm text-red-600">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setOpen(false)}
                className="rounded border px-4 py-2 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}