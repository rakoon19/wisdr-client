"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfile({ user }) {
  const router = useRouter();

  const [name, setName] = useState(user.name || "");
  const [image, setImage] = useState(user.image || "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return;

    setSaving(true);
    try {
      const res = await fetch(
        `http://localhost:5000/dashboard/profile/${user._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, image }),
        }
      );

      if (res.ok) {
        // Tells Next.js to pull fresh database records from server components
        router.refresh(); 
      }
    } catch (err) {
      console.error("Failed to update profile changes:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border p-6 space-y-4">
      <h2 className="text-xl font-semibold">Edit Profile Settings</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Display Name</label>
        <input
          type="text"
          className="mt-2 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Profile Photo URL</label>
        <input
          type="url"
          className="mt-2 w-full rounded border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="rounded bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
      >
        {saving ? "Saving Changes..." : "Save Changes"}
      </button>
    </form>
  );
}