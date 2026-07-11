"use client";
import React from "react";
import { ListBox, Label } from "@heroui/react";
import { Users, BookOpen, AlertTriangle, User } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const getItemClass = (path) => {
    const baseClass = "py-3 px-4 rounded-xl cursor-pointer transition-colors ";
    return pathname === path
      ? `${baseClass} bg-blue-600/15 text-white font-semibold`
      : `${baseClass} text-white hover:bg-zinc-900 hover:text-white`;
  };

  const navItems = [
    { id: "manage-users", label: "Manage Users", path: "/dashboard/admin/manage-users", icon: Users },
    { id: "manage-lessons", label: "Manage Lessons", path: "/dashboard/admin/manage-lessons", icon: BookOpen },
    { id: "reported-lessons", label: "Reported Lessons", path: "/dashboard/admin/reported-lessons", icon: AlertTriangle },
    { id: "profile", label: "Profile", path: "/dashboard/admin/profile", icon: User },
  ];

  return (
    <div className="flex h-screen w-64 select-none flex-col border text-white">
      <div
        className="cursor-pointer border-b border-white-800 p-6 text-lg font-bold"
        onClick={() => router.push("/dashboard/admin")}
      >
        Admin Dashboard
      </div>

      <div className="flex-1 p-4 ">
        <ListBox
          aria-label="Admin Navigation"
          selectionMode="none"
          className="gap-1 p-0"
          onAction={(id) => {
            const item = navItems.find((i) => i.id === id);
            if (item) router.push(item.path);
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
                <Label className="text-sm text-white">{label}</Label>
              </div>
            </ListBox.Item>
          ))}
        </ListBox>
      </div>

      <div className="border-t border-zinc-800 p-4 text-center text-xs text-zinc-500">
        © 2026 Admin Panel
      </div>
    </div>
  );
}