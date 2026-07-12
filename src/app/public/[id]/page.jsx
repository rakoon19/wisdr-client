"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getSession } from '@/actions/session';

export default function LessonDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  // Dynamic API Base URL configuration 
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // States
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Comments States
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Report Modal State
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    if (!id) return;

    async function initPage() {
      try {
        // 1. Fetch User Session
        const session = await getSession();
        setCurrentUser(session?.user || null);
        
        const backendUrl = `${API_BASE_URL}/public/${id}`;

        // 2. Fetch Lesson Data
        const res = await fetch(backendUrl, { cache: 'no-store' });

        if (!res.ok) throw new Error("Failed to capture lesson data stream");
        const data = await res.json();
        setLesson(data);

        if (session?.user?.email && data) {
          setIsLiked(data.likes?.includes(session.user.email) || false);
          setIsSaved(data.favorites?.includes(session.user.email) || false);
        }

        // 3. Fetch Comments
        const commentRes = await fetch(`${API_BASE_URL}/public/${id}/comments`);
        if (commentRes.ok) {
          const commentData = await commentRes.json();
          setComments(commentData);
        }
      } catch (err) {
        console.error("❌ Failure during network sequence:", err);
      } finally {
        setLoading(false);
      }
    }
    initPage();
  }, [id, API_BASE_URL]);

  // Premium Access Route Authorization Guard
  const isPremiumUser = currentUser?.plan === 'Premium'; 
  const isPremiumLesson = lesson && (lesson.accessLevelBadge === 'Premium' || lesson.visibility === 'Premium');

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950 text-slate-400 font-medium">
        Analyzing records metadata...
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950 text-slate-400 font-medium">
        Lesson record not found.
      </div>
    );
  }

  // Paywall Check Rule
  if (isPremiumLesson && !isPremiumUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-xl w-full border border-slate-800 bg-slate-900/60 p-8 md:p-12 rounded-3xl backdrop-blur-xl shadow-2xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 filter blur-3xl opacity-10 bg-gradient-to-tr from-purple-500 to-blue-500 pointer-events-none" />
          <span className="text-5xl block">💎</span>
          <h2 className="text-3xl font-black text-white tracking-tight">Premium Insight Locked</h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm mx-auto">
            {`"${lesson.title}" was published exclusively for premium community subscribers. Upgrade your access tier to unlock complete knowledge visibility.`}
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <button 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-xl transition-colors shadow-lg shadow-purple-900/40"
              onClick={() => router.push('/dashboard/pricing')}
            >
              Upgrade Plan
            </button>
            <button 
              className="bg-slate-800/60 hover:bg-slate-800 text-slate-300 font-medium px-6 py-2.5 rounded-xl border border-slate-700 transition-colors"
              onClick={() => router.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Real-Time Interaction Handlers
  const handleLikeToggle = async () => {
    if (!currentUser?.email) {
      alert("Please log in to like this lesson");
      return;
    }

    const updatedLikesCount = isLiked ? lesson.likesCount - 1 : lesson.likesCount + 1;
    setLesson({ ...lesson, likesCount: Math.max(0, updatedLikesCount) });
    setIsLiked(!isLiked);

    await fetch(`${API_BASE_URL}/public/${id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: currentUser.email })
    });
  };

  const handleSaveToggle = async () => {
    if (!currentUser?.email) {
      alert("Please log in to save lessons to your favorites list");
      return;
    }
    setIsSaved(!isSaved);
    await fetch(`${API_BASE_URL}/public/${id}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: currentUser.email })
    });
  };

  const handleReportSubmit = async () => {
    if (!currentUser?.email) {
      alert("Please login first.");
      return;
    }

    if (!reportReason) {
      alert("Please select a reason.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonId: id,
          lessonTitle: lesson.title,
          reporterName: currentUser.name,
          reporterEmail: currentUser.email,
          reason: reportReason,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to submit report");

      setReportReason("");
      setIsReportOpen(false);
      alert("Report submitted successfully.");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!currentUser?.email) {
      alert("Please log in to leave a comment");
      return;
    }

    const payload = {
      lessonId: id,
      userEmail: currentUser.email,
      userName: currentUser.name || "Anonymous User",
      userImage: currentUser.image || "",
      text: newComment,
      createdDate: new Date()
    };

    try {
      const response = await fetch(`${API_BASE_URL}/public/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const savedComment = await response.json();
        setComments([savedComment, ...comments]);
        setNewComment("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8 ">
        
        {/* 1. Main Content Section */}
        <article className="border border-slate-300 bg-slate-900/40 backdrop-blur-md rounded-3xl p-6 md:p-10 space-y-6 shadow-xl">
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 text-xs font-bold bg-blue-950/40 text-blue-400 border border-blue-900/40 rounded-full">
              {lesson.category}
            </span>
            <span className="px-3 py-1 text-xs font-bold bg-purple-950/40 text-purple-400 border border-purple-900/40 rounded-full">
              🎭 {lesson.emotionalTone}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {lesson.title}
          </h1>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 font-medium py-3 border-y border-slate-800/80">
            <div>Published: <span className="text-slate-200 font-semibold">{new Date(lesson.createdDate).toLocaleDateString()}</span></div>
            {lesson.lastUpdatedDate && (
              <div>Updated: <span className="text-slate-200 font-semibold">{new Date(lesson.lastUpdatedDate).toLocaleDateString()}</span></div>
            )}
            <div>Tier: <span className="text-emerald-400 font-bold bg-emerald-950/30 px-2 py-0.5 border border-emerald-900/50 rounded-md capitalize">{lesson.accessLevelBadge}</span></div>
            <div>⏱️ Reading Time: <span className="text-slate-200 font-semibold">{Math.ceil(lesson.description.split(' ').length / 200)} min</span></div>
            <div>👀 Impressions: <span className="text-slate-200 font-mono font-semibold">{lesson.viewsCount}</span></div>
          </div>

          {lesson.featuredImage && (
            <div className="relative h-[250px] md:h-[450px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
              <Image src={lesson.featuredImage} alt={lesson.title} className="object-cover" fill priority />
            </div>
          )}

          <p className="text-base md:text-lg text-slate-300 leading-relaxed whitespace-pre-wrap font-normal break-words pt-2">
            {lesson.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-800/80">
            <button 
              className={`font-bold px-4 py-2 rounded-xl border border-white text-sm transition-colors ${
                isLiked 
                  ? "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30" 
                  : "border-slate-800 text-slate-300 hover:bg-slate-900"
              }`}
              onClick={handleLikeToggle}
            >
              ❤️ {isLiked ? "Liked" : "Like"} ({lesson.likesCount})
            </button>

            <button 
              className={`font-bold px-4 py-2 rounded-xl border border-white text-sm transition-colors ${
                isSaved 
                  ? "bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30" 
                  : "border-slate-800 text-slate-300 hover:bg-slate-900"
              }`}
              onClick={handleSaveToggle}
            >
              🔖 {isSaved ? "Saved to Collection" : "Save to Favorites"}
            </button>

            <button 
              className="ml-auto text-red-400 hover:text-red-300 text-xs border p-4 border-red-500 font-semibold tracking-wide bg-transparent cursor-pointer"
              onClick={() => setIsReportOpen(true)}
            >
              🚩 Flag Content
            </button>
          </div>
        </article>

        {/* 2. Creator Card Section */}
        <div className="border border-slate-300 bg-slate-900/30 backdrop-blur-md shadow-lg rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 justify-between">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Image
              src={lesson.creatorImage || "/placeholder-avatar.png"} 
              alt={lesson.creatorName}
              width={400}
              height={300}
              className="w-14 h-14 rounded-full border border-slate-700 shrink-0 object-cover" 
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-0.5">Author Profile</span>
              <h3 className="text-lg font-bold text-white">{lesson.creatorName}</h3>
              <p className="text-xs text-slate-400 font-mono">{lesson.creatorEmail}</p>
            </div>
          </div>
          <button 
            className="w-full sm:w-auto bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold text-sm px-5 py-2.5 rounded-xl border border-blue-900/40 transition-colors"
            onClick={() => router.push(`/dashboard/authors/${encodeURIComponent(lesson.creatorEmail)}`)}
          >
            Explore Profile
          </button>
        </div>

        {/* 3. Community Discussion */}
        <section className="space-y-4 border border-slate-300 bg-slate-900/20 rounded-3xl p-6 md:p-8 shadow-sm">
          <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2 border-b border-slate-800/60 pb-3">
            🗣️ Community Discussion ({comments.length})
          </h3>

          {currentUser ? (
            <form onSubmit={handlePostComment} className="space-y-3 pt-2">
              <textarea
                placeholder="Share your analytical interpretation or input..."
                className="w-full border border-slate-300 hover:border-slate-100 focus:border-blue-500 bg-slate-950/40 rounded-xl text-white placeholder:text-slate-500 text-sm p-4 focus:outline-none transition-colors"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl px-6 py-2.5 transition-colors"
              >
                Post Comment
              </button>
            </form>
          ) : (
            <div className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-xl text-xs text-slate-400 text-center font-medium">
              Please register or sign in to participate in the conversation stream.
            </div>
          )}

          <div className="space-y-3 pt-4">
            {comments.map((comment) => (
              <div key={comment._id} className="p-4 border border-slate-300/60 bg-slate-950/20 rounded-xl flex gap-3 items-start hover:border-slate-800 transition-colors">
                <Image 
                  src={comment.userImage || "/placeholder-avatar.png"} 
                  alt={comment.userName}
                  width={600}
                  height={400}
                  className="w-8 h-8 rounded-full border border-slate-800 shrink-0 object-cover mt-0.5" 
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-200 truncate">{comment.userName}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(comment.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed break-words">{comment.text}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-center py-8 text-xs font-medium text-slate-500">No input observations noted yet.</p>
            )}
          </div>
        </section>

        {/* 4. Reporting Modal */}
        {isReportOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md border border-slate-800 bg-slate-900 text-slate-100 rounded-2xl shadow-2xl overflow-hidden">
              
              <div className="border-b border-slate-800 p-4">
                <h2 className="text-base font-bold text-white">Report Lesson</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                  Reason for moderation flag
                </label>
                <select
                  className="w-full border border-slate-800 hover:border-slate-700 focus:border-blue-500 bg-slate-950 text-slate-200 text-sm rounded-xl p-3 focus:outline-none transition-colors appearance-none"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                >
                  <option value="" disabled className="bg-slate-900 text-slate-500">Select a category</option>
                  <option value="Misinformation" className="bg-slate-900 text-slate-200">Misinformation</option>
                  <option value="Plagiarism" className="bg-slate-900 text-slate-200">Plagiarism</option>
                  <option value="Inappropriate" className="bg-slate-900 text-slate-200">Inappropriate Content</option>
                  <option value="Other" className="bg-slate-900 text-slate-200">Other</option>
                </select>
              </div>

              <div className="border-t border-slate-800 p-4 bg-slate-900/50 flex justify-end gap-3">
                <button 
                  className="border border-slate-800 hover:bg-slate-800 text-slate-300 font-medium text-sm px-4 py-2 rounded-xl transition-colors"
                  onClick={() => {
                    setIsReportOpen(false);
                    setReportReason("");
                  }}
                >
                  Cancel
                </button>
                <button 
                  disabled={!reportReason}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-sm px-4 py-2 rounded-xl transition-colors disabled:opacity-40" 
                  onClick={handleReportSubmit}
                >
                  Submit Report
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}