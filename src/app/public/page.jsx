"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import Image from "next/image";
import { Globe, Tag, Search, ChevronDown, X } from "lucide-react";
import Pagination from "./Pagination";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function PublicLessonsPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalDoc, setTotalDoc] = useState(0);
  
  // State Trackers for Filtering, Searching, and Sorting
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [emotionalTone, setEmotionalTone] = useState("");
  const [sort, setSort] = useState("newest");

  // Local fluid typing state and api debouncer state
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Handle debouncing search updates to maximize typing speeds
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(inputValue);
      setPage(1); 
    }, 400);

    return () => clearTimeout(timer);
  }, [inputValue]);

  // Reset page back to 1 if user updates filter dropdown selections
  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1);
  };

  useEffect(() => {
    async function fetchLessons() {
      try {
        setLoading(true);
        
        const queryParams = new URLSearchParams({
          page,
          search: debouncedSearch,
          category,
          emotionalTone,
          sort
        }).toString();

        const response = await fetch(`${API_BASE}/public?${queryParams}`);

        if (!response.ok) {
          throw new Error(`HTTP network error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data.cursor)) {
          setLessons(data.cursor);
          setTotalDoc(data.totalDoc);
        }
      } catch (error) {
        console.error("Failed fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, [page, debouncedSearch, category, emotionalTone, sort]);

  const formatDate = (dateInput) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const categoryLabels = {
    "": "Select category",
    "Personal Growth": "Personal Growth",
    "Career": "Career",
    "Relationships": "Relationships",
    "Mindset": "Mindset",
    "Mistakes Learned": "Mistakes Learned"
  };

  const toneLabels = {
    "": "Select tone",
    "Motivational": "Motivational",
    "Sad": "Sad",
    "Realization": "Realization",
    "Gratitude": "Gratitude",
    "Inspiring": "Inspiring"
  };

  const sortLabels = {
    "newest": "Newest First",
    "most-saved": "Most Saved"
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 bg-black p-6 md:p-10 text-white">
      <header className="border-b border-zinc-800 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          Shared Life Lessons
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Explore collective wisdom, personal growth milestones, and experiences shared by creators.
        </p>
      </header>

      {/* SEARCH + FILTER + SORT CONTROLS BAR */}
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-zinc-800 bg-zinc-900/20 p-4 sm:grid-cols-2 lg:grid-cols-5 items-center">
        
        {/* SEMANTIC EMBEDDED SEARCH INPUT ELEMENT (FIXED CONSOLE ERROR AND TYPING LOCKS) */}
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 size-4 pointer-events-none transition-colors group-focus-within:text-blue-500" />
          <input
            type="text"
            className="w-full h-10 bg-zinc-900/40 text-sm border border-zinc-800 rounded-xl pl-9 pr-8 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="Search by title or keyword..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          {inputValue && (
            <button
              type="button"
              onClick={() => setInputValue("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors p-0.5 rounded-md hover:bg-zinc-800"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {/* Dynamic Category Popover */}
        <Popover placement="bottom-start" className="dark">
          <PopoverTrigger>
            <Button 
              variant="bordered" 
              className="w-full border-zinc-800 text-left justify-between text-zinc-300 bg-zinc-900/40 rounded-xl font-medium h-10 px-3"
            >
              <span className="truncate">{categoryLabels[category] || "Select category"}</span>
              <ChevronDown className="size-4 opacity-70 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] border border-zinc-800 bg-zinc-950 p-1 rounded-xl shadow-xl">
            <div className="flex flex-col gap-0.5 w-full">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium transition-colors
                    ${category === key 
                      ? "bg-blue-600 text-white" 
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`}
                  onClick={() => handleFilterChange(setCategory, key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Dynamic Emotional Tone Popover */}
        <Popover placement="bottom-start" className="dark">
          <PopoverTrigger>
            <Button 
              variant="bordered" 
              className="w-full border-zinc-800 text-left justify-between text-zinc-300 bg-zinc-900/40 rounded-xl font-medium h-10 px-3"
            >
              <span className="truncate">{toneLabels[emotionalTone] || "Select tone"}</span>
              <ChevronDown className="size-4 opacity-70 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] border border-zinc-800 bg-zinc-950 p-1 rounded-xl shadow-xl">
            <div className="flex flex-col gap-0.5 w-full">
              {Object.entries(toneLabels).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium transition-colors
                    ${emotionalTone === key 
                      ? "bg-blue-600 text-white" 
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`}
                  onClick={() => handleFilterChange(setEmotionalTone, key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Dynamic Sort Order Popover */}
        <Popover placement="bottom-start" className="dark">
          <PopoverTrigger>
            <Button 
              variant="bordered" 
              className="w-full border-zinc-800 text-left justify-between text-zinc-300 bg-zinc-900/40 rounded-xl font-medium h-10 px-3"
            >
              <span className="truncate">{sortLabels[sort] || "Sort By"}</span>
              <ChevronDown className="size-4 opacity-70 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] border border-zinc-800 bg-zinc-950 p-1 rounded-xl shadow-xl">
            <div className="flex flex-col gap-0.5 w-full">
              {Object.entries(sortLabels).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg font-medium transition-colors
                    ${sort === key 
                      ? "bg-blue-600 text-white" 
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`}
                  onClick={() => handleFilterChange(setSort, key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Filters Button */}
        {(inputValue || category || emotionalTone || sort !== "newest") && (
          <Button 
            variant="light" 
            className="text-zinc-400 hover:text-white font-medium h-10" 
            onPress={() => {
              setInputValue("");
              setDebouncedSearch("");
              setCategory("");
              setEmotionalTone("");
              setSort("newest");
              setPage(1);
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* RESULTS DISPLAY CONTROLLER */}
      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center bg-black font-medium text-zinc-400">
          Loading insightful lessons...
        </div>
      ) : lessons.length === 0 ? (
        <div className="mx-auto min-h-[400px] max-w-xl bg-black px-4 py-16 text-center">
          <h2 className="mb-2 text-2xl font-bold text-white">No Lessons Found</h2>
          <p className="mb-6 text-zinc-400">
            We couldn't find anything matching your filters. Try adjusting your parameters!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <Card
                key={lesson._id || lesson.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-blue-900/50 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-blue-950/40"
              >
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
                      {lesson?.creatorImage && (
                        <Image
                          alt={lesson.creatorName || "Creator Avatar"}
                          className="object-cover"
                          loading="lazy"
                          src={lesson.creatorImage}
                          fill
                          sizes="40px"
                        />
                      )}
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

          <Pagination 
            totalDoc={totalDoc} 
            activePage={page} 
            onPageChange={setPage} 
          />
        </>
      )}
    </div>
  );
}