"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card } from "@heroui/react";
import Image from "next/image";
import { Globe, Tag } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function PublicLessonsPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessons() {
      try {
        const response = await fetch(`${API_BASE}/public`);

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
    if (!dateInput) return "";
    const date = new Date(dateInput);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-black font-medium text-zinc-400">
        Loading insightful lessons...
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="mx-auto min-h-[400px] max-w-xl bg-black px-4 py-16 text-center">
        <h2 className="mb-2 text-2xl font-bold text-white">No Lessons Yet</h2>
        <p className="mb-6 text-zinc-400">
          Be the first one to share an experience with the world!
        </p>
        <Button
          radius="xl"
          className="bg-blue-600 font-medium text-white hover:bg-blue-500"
          onPress={() => router.push("/dashboard/add-lesson")}
        >
          Create a Lesson
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 bg-black p-6 md:p-10">
      <header className="border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          Shared Life Lessons
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Explore collective wisdom, personal growth milestones, and experiences shared by creators.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <Card
            key={lesson._id || lesson.id}
            className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-blue-900/50 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-blue-950/40"
          >
            {/* Top accent line, brightens on hover */}
            <div className="h-1 w-full bg-gradient-to-r from-blue-600/40 via-purple-600/30 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="flex flex-col gap-4 p-5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full border border-blue-900/50 bg-blue-950/40 px-3 py-1 text-xs font-semibold text-blue-400 shadow-sm shadow-blue-950/30 transition-transform duration-150 hover:scale-105">
                  <Tag className="size-3" />
                  {lesson.category}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-purple-900/50 bg-purple-950/40 px-3 py-1 text-xs font-semibold text-purple-400 shadow-sm shadow-purple-950/30 transition-transform duration-150 hover:scale-105">
                  🎭 {lesson.emotionalTone}
                </span>
                <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-emerald-900/50 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-400 shadow-sm shadow-emerald-950/30 transition-transform duration-150 hover:scale-105">
                  <Globe className="size-3" />
                  {lesson.accessLevelBadge || lesson.visibility || "Public"}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="line-clamp-1 text-xl font-bold tracking-tight text-white transition-colors group-hover:text-blue-100">
                  {lesson.title}
                </h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-zinc-400">
                  {lesson.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-zinc-800/80 bg-zinc-950/40 p-5">
              <div className="flex w-full items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-zinc-800 ring-1 ring-zinc-700/50 transition-colors group-hover:border-blue-900/60">
                  <Image
                    alt={lesson.creatorName || "Creator Avatar"}
                    className="object-cover"
                    loading="lazy"
                    src={
                      lesson?.creatorImage
                    }
                    fill
                    sizes="40px"
                  />
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-semibold text-zinc-200">
                    {lesson.creatorName || "Anonymous Author"}
                  </span>
                  <span className="text-xs font-medium text-zinc-500">
                    {formatDate(lesson?.createdDate)}
                  </span>
                </div>
              </div>

              <Button
                variant="flat"
                className="group/btn w-full rounded-xl border border-blue-500 bg-blue-600 font-bold tracking-wide text-white transition-all duration-200 hover:bg-blue-500"
                onPress={() => router.push(`/public/${lesson._id || lesson.id}`)}
              >
                <span className="flex items-center justify-center gap-1.5">
                  See Details
                  <span className="transition-transform duration-200 group-hover/btn:translate-x-0.5">
                    →
                  </span>
                </span>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}