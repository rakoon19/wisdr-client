"use client";

import { ListBox, Label } from "@heroui/react";
import {
  LayoutDashboard,
  PlusCircle,
  BookOpen,
  Heart,
  User,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function UserSideBar() {
  const router = useRouter();
  const pathname = usePathname();

  const getItemClass = (path) => {
    const base = "py-3 px-4 rounded-xl cursor-pointer transition-colors text-white";

    return pathname === path
      ? `${base} bg-blue-600/15 text-blue-400 font-semibold`
      : `${base} text-zinc-400 hover:bg-zinc-900 hover:text-white`;
  };

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "add-lesson",
      label: "Add Lesson",
      path: "/dashboard/add-lesson",
      icon: PlusCircle,
    },
    {
      id: "my-lessons",
      label: "My Lessons",
      path: "/dashboard/my-lessons",
      icon: BookOpen,
    },
    {
      id: "favorites",
      label: "My Favorites",
      path: "/dashboard/my-favorites",
      icon: Heart,
    },
    {
      id: "profile",
      label: "Profile",
      path: "/dashboard/profile",
      icon: User,
    },
  ];

  return (
    <div className="flex h-screen w-64 flex-col border bg-black text-white">
      <div
        className="cursor-pointer border-b border-white p-6 text-lg font-bold"
        onClick={() => router.push("/dashboard")}
      >
        User Dashboard
      </div>

      <div className="flex-1 p-4">
        <ListBox
          aria-label="User Navigation"
          selectionMode="none"
          className="gap-1"
          onAction={(id) => {
            const item = navItems.find((x) => x.id === id);

            if (item) {
              router.push(item.path);
            }
          }}
        >
          {navItems.map(({ id, label, path, icon: Icon }) => (
            <ListBox.Item
              key={id}
              id={id}
              textValue={label}
              className={getItemClass(path)}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} />
                <Label className="text-white">{label}</Label>
              </div>
            </ListBox.Item>
          ))}
        </ListBox>
      </div>

      <div className="border-t border-zinc-300 p-4 text-center text-xs text-zinc-500">
        © 2026 Wisdr
      </div>
    </div>
  );
}