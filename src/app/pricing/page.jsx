"use client";

import React, { useState } from 'react';
import { Button } from '@heroui/react';

export default function PricingComparisonPage() {
  const [loading, setLoading] = useState(false);

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
    <div className="max-w-4xl mx-auto p-4 md:p-10 space-y-8 text-slate-100 my-8">
      
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Comparison Table
        </h2>
      </div>

      {/* Tailwind Grid Alternative */}
      <div className="border border-slate-800 bg-slate-900/30 backdrop-blur-md rounded-3xl p-6 shadow-xl overflow-hidden">
        
        {/* Header Row */}
        <div className="grid grid-cols-3 gap-4 pb-4 border-b border-slate-800 font-bold text-xs uppercase tracking-wider text-slate-400">
          <div>Features</div>
          <div>Free Plan</div>
          <div className="text-purple-400">💎 Premium Plan</div>
        </div>

        {/* Data Rows */}
        <div className="divide-y divide-slate-800/60">
          {comparisonRows.map((row) => (
            <div key={row.id} className="grid grid-cols-3 gap-4 py-4 text-sm items-center hover:bg-slate-800/10 transition-colors">
              <div className="font-medium text-slate-200">{row.feature}</div>
              <div className="text-slate-400">{row.free}</div>
              <div className="font-semibold text-purple-400">{row.premium}</div>
            </div>
          ))}
        </div>

      </div>

      <div className="flex justify-center pt-4">
          <form action="/api/checkout_sessions" method="POST">
          <section>
            <button type="submit" role="link" 
            className="font-extrabold px-12 py-6 text-white text-base bg-linear-to-r from-purple-600 to-indigo-600"
            >
              Upgrade to Premium Access
            </button>
          </section>
        </form>
      </div>

    </div>
  );
}