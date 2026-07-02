"use client";
import React from "react";
import { ListBox, Label } from "@heroui/react";
import { Users, BookOpen, AlertTriangle, User } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export default function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const getItemClass = (path) => {
    const baseClass = "py-3 px-4 rounded-xl cursor-pointer transition-colors";
    return pathname === path
      ? `${baseClass} bg-primary-50 text-primary font-semibold`
      : `${baseClass} text-default-600 hover:bg-default-100`;
  };

  const navItems = [
    { id: "manage-users", label: "Manage Users", path: "/dashboard/admin/manage-users", icon: Users },
    { id: "manage-lessons", label: "Manage Lessons", path: "/dashboard/admin/manage-lessons", icon: BookOpen },
    { id: "reported-lessons", label: "Reported Lessons", path: "/dashboard/admin/reported-lessons", icon: AlertTriangle },
    { id: "profile", label: "Profile", path: "/dashboard/admin/profile", icon: User },
  ];

  return (
    <div className="w-64 h-screen border-r border-divider flex flex-col bg-background select-none border border-r-amber-500">
      <div className="p-6 font-bold text-lg border border-b-amber-500 border-divider">
        Admin Dashboard
      </div>

      <div className="flex-1 p-4">
        <ListBox
          aria-label="Admin Navigation"
          selectionMode="none"
          className="p-0 gap-1"
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
                <Label className="text-sm">{label}</Label>
              </div>
            </ListBox.Item>
          ))}
        </ListBox>
      </div>

      <div className="p-4 text-xs text-default-400 border-t border-divider text-center">
        © 2026 Admin Panel
      </div>
    </div>
  );
}