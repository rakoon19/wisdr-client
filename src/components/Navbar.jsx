'use client';

import React, { useEffect, useRef, useState } from "react";
import { Button, Avatar } from "@heroui/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  LogOut,
  LayoutDashboard,
  User,
  CreditCard,
  Layers,
  Menu,
  X,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountRef = useRef(null);

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsAccountOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isAccountOpen) return;

    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setIsAccountOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsAccountOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isAccountOpen]);

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  const goTo = (href) => {
    setIsAccountOpen(false);
    router.push(href);
  };

  const isLoggedIn = !!session;
  const userPlan = session?.user?.plan || "Free";
  const userDisplayName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const userAvatarUrl = session?.user?.image || "";

  const navigationLinks = [
    { label: "Home", href: "/", show: true },
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

  const accountMenuItems = [
    { label: "My Profile", href: "/dashboard/profile", icon: User },
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: `Subscription (${userPlan})`, href: "/pricing", icon: CreditCard },
    { label: "Update Log", href: "/updates", icon: Layers },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 text-white backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile hamburger + Brand */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMenuOpen((o) => !o)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:hidden"
          >
            {isMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-blue-600/20 text-blue-400">
              <Layers className="size-5" />
            </span>
            <span className="text-xl font-bold tracking-tight">Wisdr</span>
          </Link>
        </div>

        {/* Center: Desktop nav links */}
        <nav className="hidden items-center gap-1 sm:flex">
          {visibleLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-blue-400"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Auth controls */}
        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="size-9 animate-pulse rounded-full bg-zinc-800" />
          ) : !isLoggedIn ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/login")}
                className="text-zinc-300 hover:text-white"
              >
                Login
              </Button>
              <Button
                size="sm"
                onClick={() => router.push("/register")}
                className="bg-blue-600 font-medium text-white hover:bg-blue-500"
              >
                Sign Up
              </Button>
            </>
          ) : (
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setIsAccountOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={isAccountOpen}
                className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <Avatar
                  color="primary"
                  className="size-9 cursor-pointer border border-blue-600 text-sm transition-transform hover:scale-105"
                  name={userDisplayName}
                  src={userAvatarUrl}
                />
              </button>

              {isAccountOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-3 w-60 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl"
                >
                  <div className="mb-1 flex items-center gap-3 border-b border-zinc-800 px-2 pb-3 pt-1">
                    <Avatar
                      className="size-10 shrink-0 text-md"
                      name={userDisplayName}
                      src={userAvatarUrl}
                    />
                    <div className="flex min-w-0 flex-col">
                      <p className="truncate text-sm font-semibold text-white">
                        {userDisplayName}
                      </p>
                      <p className="truncate text-xs text-zinc-500">{userEmail}</p>
                    </div>
                  </div>

                  {accountMenuItems.map(({ label, href, icon: Icon }) => (
                    <button
                      key={href}
                      type="button"
                      role="menuitem"
                      onClick={() => goTo(href)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-zinc-300 transition-colors duration-150 hover:bg-zinc-800"
                    >
                      <Icon className="size-4 text-zinc-500" />
                      {label}
                    </button>
                  ))}

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsAccountOpen(false);
                      handleSignOut();
                    }}
                    className="mt-1 flex w-full items-center gap-2.5 rounded-none border-t border-zinc-800 px-2.5 py-2 pt-3 text-left text-sm font-medium text-red-400 transition-colors duration-150 hover:bg-red-950/40"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {isMenuOpen && (
        <div className="border-t border-zinc-800 bg-black/95 sm:hidden">
          <nav className="space-y-1 px-4 py-3">
            {visibleLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-blue-600/15 text-blue-400"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {!isLoggedIn && !isPending && (
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  variant="bordered"
                  className="w-full border-zinc-700 text-zinc-300"
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push("/login");
                  }}
                >
                  Login
                </Button>
                <Button
                  className="w-full bg-blue-600 font-medium text-white hover:bg-blue-500"
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push("/register");
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}