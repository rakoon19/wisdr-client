/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from "react";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { LogOut, LayoutDashboard, User, CreditCard, Layers, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  const isLoggedIn = !!session;
  const userPlan = session?.user?.plan || "Free";
  const userDisplayName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userAvatarUrl = session?.user?.image || "";

  const navigationLinks = [
    { label: "Home", href: "/", show: true },
    { label: "Add Lesson", href: "/dashboard/add-lesson", show: isLoggedIn },
    { label: "My Lessons", href: "/dashboard/my-lessons", show: isLoggedIn },
    { label: "Public Lessons", href: "/public", show: true },
    {
      label: "Pricing / Upgrade",
      href: "/pricing",
      show: isLoggedIn && userPlan === "Free",
    },
  ];

  const visibleLinks = navigationLinks.filter((link) => link.show);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    // Added relative positioning to navigation layout context
    <nav className="relative sticky top-0 z-40 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-md text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Left: Brand & Mobile Hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white sm:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <span className="bg-blue-600/20 text-blue-400 p-1.5 rounded-md text-sm leading-none">
                📚
              </span>
              <span>LessonHub</span>
            </Link>
          </div>

          {/* Center: Desktop Nav Links */}
          <ul className="hidden sm:flex items-center gap-6 flex-1 justify-center">
            {visibleLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-150 ${
                    isActive(link.href)
                      ? "text-blue-400"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right: Auth Controls */}
          <div className="flex items-center justify-end shrink-0">
            {isPending ? (
              <div className="w-9 h-9 rounded-full bg-zinc-800 animate-pulse" />
            ) : !isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Button
                  as={Link}
                  href="/login"
                  variant="ghost"
                  size="sm"
                  className="text-zinc-300 hover:text-white"
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  href="/signup"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium"
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              <Dropdown
                placement="bottom-end"
                offset={12}
                classNames={{
                  content:
                    "p-0 border border-zinc-800 bg-zinc-950 min-w-[240px] shadow-2xl rounded-xl overflow-hidden",
                }}
              >
                {/* FIX: Removed the <button> wrapper completely.
                  HeroUI's Avatar natively handles property forwarding, focus rings,
                  and ref properties required by the floating UI layout algorithm.
                */}
                <DropdownTrigger>
                  <Avatar
                    color="primary"
                    as="button"
                    className="w-9 h-9 text-sm cursor-pointer hover:scale-105 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    name={userDisplayName}
                    src={userAvatarUrl}
                  />
                </DropdownTrigger>

                <DropdownMenu
                  aria-label="Account menu"
                  className="p-1.5"
                  itemClasses={{
                    base: "rounded-lg data-[hover=true]:bg-zinc-800 transition-colors duration-150",
                    title: "text-sm text-zinc-300 font-medium",
                  }}
                >
                  <DropdownItem
                    key="profile_header"
                    isReadOnly
                    className="cursor-default pb-3 pt-2.5 border-b border-zinc-800 mb-1 rounded-none data-[hover=true]:bg-transparent"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        className="w-10 h-10 text-md shrink-0"
                        name={userDisplayName}
                        src={userAvatarUrl}
                      />
                      <div className="flex flex-col min-w-0">
                        <p className="font-semibold text-sm text-white truncate">
                          {userDisplayName}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">{userEmail}</p>
                      </div>
                    </div>
                  </DropdownItem>

                  <DropdownItem
                    key="profile"
                    onPress={() => router.push("/profile")}
                    startContent={<User className="w-4 h-4 text-zinc-500" />}
                  >
                    My Profile
                  </DropdownItem>

                  <DropdownItem
                    key="dashboard"
                    onPress={() => router.push("/dashboard")}
                    startContent={<LayoutDashboard className="w-4 h-4 text-zinc-500" />}
                  >
                    Dashboard
                  </DropdownItem>

                  <DropdownItem
                    key="subscription"
                    onPress={() => router.push("/pricing")}
                    startContent={<CreditCard className="w-4 h-4 text-zinc-500" />}
                  >
                    Subscription ({userPlan})
                  </DropdownItem>

                  <DropdownItem
                    key="updates"
                    onPress={() => router.push("/updates")}
                    startContent={<Layers className="w-4 h-4 text-zinc-500" />}
                  >
                    Update Log
                  </DropdownItem>

                  <DropdownItem
                    key="logout"
                    color="danger"
                    onPress={handleSignOut}
                    className="mt-1 border-t border-zinc-800 rounded-none data-[hover=true]:bg-red-950/40"
                    startContent={<LogOut className="w-4 h-4" />}
                  >
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-zinc-800 bg-black/95 px-4 pb-4 pt-2">
          <ul className="flex flex-col gap-1">
            {visibleLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-blue-600/15 text-blue-400"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}

            {!isLoggedIn && !isPending && (
              <li className="mt-3 flex flex-col gap-2 pt-3 border-t border-zinc-800">
                <Button
                  as={Link}
                  href="/login"
                  variant="bordered"
                  size="sm"
                  className="w-full text-zinc-300 border-zinc-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  href="/signup"
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Button>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}