"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/actions/session";

export default function PricingComparisonPage() {
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const data = await getSession();
      setSession(data);
      setSessionLoading(false);
    };

    loadSession();
  }, []);

  const isPurchased =
    session?.user?.role === "pro" || session?.user?.role === "admin";

  const comparisonRows = [
    { id: 1, feature: "Number of lessons that can be created", free: "Up to 3", premium: "Unlimited" },
    { id: 2, feature: "Premium lesson creation access", free: "❌ No", premium: "✅ Full Access" },
    { id: 3, feature: "Ad-free experience", free: "❌ Contains Ads", premium: "✅ Ad-Free" },
    { id: 4, feature: "Priority listing in public lessons", free: "❌ Standard", premium: "✅ High Priority Boost" },
    { id: 5, feature: "Access to premium content from other users", free: "❌ Blocked", premium: "✅ Unlimited View" },
    { id: 6, feature: "Community badge / verified status", free: "❌ Standard User", premium: "💎 Premium Verified" },
    { id: 7, feature: "Dedicated customer support tier", free: "Standard Email", premium: "24/7 Priority Chat" },
  ];

  return (
    <div className="mx-auto my-8 max-w-4xl space-y-8 bg-black p-4 text-white md:p-10 border border-white">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          Comparison Table
        </h2>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white bg-zinc-900/50 p-6 shadow-xl backdrop-blur-md">
        <div className="grid grid-cols-3 gap-4 border-b border-white pb-4 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <div>Features</div>
          <div>Free Plan</div>
          <div className="text-blue-400">💎 Premium Plan</div>
        </div>

        <div className="divide-y divide-zinc-800/60 ">
          {comparisonRows.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-3 items-center gap-4 py-4 text-sm "
            >
              <div className="text-zinc-200 ">{row.feature}</div>
              <div className="text-zinc-400">{row.free}</div>
              <div className="text-blue-400">{row.premium}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        {sessionLoading ? (
          <div className="h-12 w-40 animate-pulse rounded-lg bg-zinc-800" />
        ) : (
          <form action="/api/checkout_sessions" method="POST">
            <button
              type="submit"
              disabled={isPurchased}
              className={`rounded-lg px-6 py-3 font-medium transition ${
                isPurchased
                  ? "cursor-not-allowed bg-zinc-400 text-zinc-200"
                  : "bg-blue-600 text-white hover:bg-blue-500"
              }`}
            >
              {session?.user?.role === "admin"
                ? "Admin Access"
                : session?.user?.role === "pro"
                ? "Already Purchased"
                : "Purchase Pro"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}