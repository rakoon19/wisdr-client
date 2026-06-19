"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, CardContent, CardFooter } from '@heroui/react';
import Image from 'next/image';

export default function PublicLessonsPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessons() {
      try {
        const response = await fetch('http://localhost:5000/public');

        if (!response.ok) {
          throw new Error(`HTTP network error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        if (Array.isArray(data)) {
          setLessons(data);
        }
      } catch (error) {
        console.error("Failed fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, []);

  const formatDate = (dateInput) => {
    if (!dateInput) return '';
    const date = new Date(dateInput);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] font-medium text-slate-400">
        Loading insightful lessons...
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="text-center py-16 max-w-xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">No Lessons Yet</h2>
        <p className="text-slate-400 mb-6">Be the first one to share an experience with the world!</p>
        <Button color="primary" radius="xl" onClick={() => router.push('/dashboard/add-lesson')}>
          Create a Lesson
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
      <header className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          Shared Life Lessons
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Explore collective wisdom, personal growth milestones, and experiences shared by creators.
        </p>
      </header>

      {/* Responsive Grid System */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <Card 
            key={lesson._id || lesson.id} 
            className="border border-slate-800 bg-slate-900/50 backdrop-blur-md rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all duration-300 shadow-sm"
          >
            <CardContent className="p-5 flex flex-col gap-4">
              {/* Badges / Category row */}
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-blue-950/40 text-blue-400 border border-blue-900/50 rounded-full">
                  {lesson.category}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-purple-950/40 text-purple-400 border border-purple-900/50 rounded-full">
                  🎭 {lesson.emotionalTone}
                </span>
                <span className="px-2.5 py-0.5 text-xs font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-900/50 rounded-full ml-auto">
                  {lesson.accessLevelBadge || lesson.visibility || 'Public'}
                </span>
              </div>

              {/* Title & Preview text */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tight line-clamp-1">
                  {lesson.title}
                </h3>
                <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                  {lesson.description}
                </p>
              </div>
            </CardContent>

            {/* Bottom Section containing Creator details and action */}
            <CardFooter className="p-5 border-t border-slate-800/80 flex flex-col gap-4 bg-slate-900/30">
              {/* Creator Info details */}
              <div className="flex items-center gap-3 w-full">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-700">
                  <Image
                    alt={lesson.creatorName || "Creator Avatar"}
                    className="object-cover"
                    loading="lazy"
                    src={lesson.creatorImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb"}
                    fill 
                    sizes="40px" 
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-slate-200 truncate">
                    {lesson.creatorName || 'Anonymous Author'}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {formatDate(lesson.createdDate)}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                color="primary"
                variant="flat"
                className="w-full font-bold tracking-wide rounded-xl bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white transition-colors duration-200"
                onClick={() => router.push(`/public/${lesson._id || lesson.id}`)}
              >
                See Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}