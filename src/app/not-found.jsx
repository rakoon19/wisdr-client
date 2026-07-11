"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased flex items-center justify-center p-4">
      <div className="max-w-md w-full border border-slate-800 bg-slate-900/40 p-8 md:p-12 rounded-3xl backdrop-blur-xl shadow-2xl text-center space-y-6 relative overflow-hidden">
        
        {/* Subtle Ambient Background Glows */}
        <div className="absolute inset-0 filter blur-3xl opacity-10 bg-gradient-to-tr from-blue-500 to-purple-500 pointer-events-none" />

        {/* Big Error Graphic Tag */}
        <div className="space-y-2 select-none">
          <h1 className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 tracking-tighter">
            404
          </h1>
          <p className="text-sm font-bold uppercase tracking-widest text-blue-400 bg-blue-950/40 border border-blue-900/40 px-3 py-1 rounded-full inline-block">
            Route Not Found
          </p>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Youve ventured into deep space
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
            The destination link you are attempting to trace does not exist, or has been relocated across our pipeline infrastructure.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
          <button 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-lg shadow-blue-900/20 cursor-pointer"
            onClick={() => router.push('/')}
          >
            Return to Home
          </button>

        </div>

      </div>
    </div>
  );
}