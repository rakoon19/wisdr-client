"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfileForm({ admin }) {
  const router = useRouter();

  const [name, setName] = useState(admin.name);
  const [image, setImage] = useState(admin.image);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(
      `http://localhost:5000/dashboard/admin/profile/${admin._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          image,
        }),
      }
    );

    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 rounded-xl border p-6 space-y-4"
    >
      <div>
        <label className="font-medium">Display Name</label>

        <input
          className="mt-2 w-full rounded border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="font-medium">Profile Photo URL</label>

        <input
          className="mt-2 w-full rounded border p-2"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>

      <button
        className="rounded bg-blue-600 px-4 py-2 text-white"
      >
        Save Changes
      </button>
    </form>
  );
}