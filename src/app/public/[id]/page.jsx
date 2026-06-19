"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Button, 
  Card, 
  CardContent, 
  Avatar, 
  Separator, 
  Modal, 
  ModalContainer, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  useOverlayState, 
  Select, 
  SelectValue, 
  TextArea 
} from '@heroui/react';
import Image from 'next/image';
import { getSession } from '@/actions/session';

export default function LessonDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  // States
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Comments States
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Report Modal Hook (Fixed to use stable HeroUI hook)
  const { isOpen, onOpen, onOpenChange } = useOverlayState();
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    async function initPage() {
      try {
        // 1. Fetch User Session
        const session = await getSession();
        setCurrentUser(session?.user || null);

        // --- DIAGNOSTIC LOG MARKERS FOR THE 404 BUG ---
        console.log("🔍 [DEBUG] 1. Extract Route Parameter ID value:", id);
        console.log("🔍 [DEBUG] 2. Current Session User Context:", session?.user);
        
        const backendUrl = `http://localhost:5000/public/${id}`;
        console.log("🔍 [DEBUG] 3. Target String Constructed for Fetch:", backendUrl);
        // ------------------------------------------------

        // 2. Fetch Lesson Data
        const res = await fetch(backendUrl, { cache: 'no-store' });
        
        // --- DIAGNOSTIC LOG FOR RESPONSE ENGINE ---
        console.log("🔍 [DEBUG] 4. Fetch Response Network Metadata Handshake:", {
          status: res.status,
          statusText: res.statusText,
          ok: res.ok,
          urlCalled: res.url
        });
        // -------------------------------------------

        if (!res.ok) throw new Error("Failed to capture lesson data stream");
        const data = await res.json();
        setLesson(data);
        console.log("🔍 [DEBUG] 5. Successfully Parsed JSON Payload from Backend:", data);

        // Set initial user engagement toggles if data exists
        if (session?.user?.email && data) {
          setIsLiked(data.likes?.includes(session.user.email) || false);
          setIsSaved(data.favorites?.includes(session.user.email) || false);
        }

        // 3. Fetch Comments
        const commentRes = await fetch(`http://localhost:5000/public/${id}/comments`);
        if (commentRes.ok) {
          const commentData = await commentRes.json();
          setComments(commentData);
        }
      } catch (err) {
        console.error("❌ [DEBUG ERROR] Failure during network sequence execution:", err);
      } finally {
        setLoading(false);
      }
    }
    initPage();
  }, [id]);

  // Premium Access Route Authorization Guard
  const isPremiumUser = currentUser?.plan === 'Premium'; 
  const isPremiumLesson = lesson && (lesson.accessLevelBadge === 'Premium' || lesson.visibility === 'Premium');

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-slate-400 font-medium">Analyzing records metadata...</div>;
  }

  if (!lesson) {
    return <div className="flex justify-center items-center min-h-screen text-slate-400 font-medium">Lesson record not found.</div>;
  }

  // Paywall Check Rule
  if (isPremiumLesson && !isPremiumUser) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-10 text-center space-y-6 my-12">
        <div className="relative border border-slate-800 bg-slate-900/40 p-12 rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Blurred Background Preview Graphic */}
          <div className="absolute inset-0 filter blur-xl opacity-10 bg-gradient-to-tr from-purple-500 to-blue-500 pointer-events-none" />
          
          <span className="text-4xl">💎</span>
          <h2 className="text-3xl font-extrabold text-white mt-4">Premium Insight Locked</h2>
          <p className="text-slate-400 max-w-md mx-auto mt-2">
            {`"${lesson.title}" was published exclusively for premium community subscribers. Upgrade your access tier to unlock complete knowledge visibility.`}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button color="secondary" variant="shadow" radius="xl" className="font-bold px-8" onClick={() => router.push('/dashboard/pricing')}>
              Upgrade Plan
            </Button>
            <Button color="default" variant="flat" radius="xl" className="text-slate-300" onClick={() => router.back()}>
              Go Back
            </Button>
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

    await fetch(`http://localhost:5000/public/${id}/like`, {
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
    await fetch(`http://localhost:5000/public/${id}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: currentUser.email })
    });
  };

  const handleReportSubmit = async (onClose) => {
    if (!currentUser?.email) return;
    
    await fetch(`http://localhost:5000/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        lessonId: id,
        reporterUserEmail: currentUser.email,
        reason: reportReason,
        timestamp: new Date()
      })
    });

    setReportReason("");
    onClose();
    alert("Thank you. The content has been flagged for administrative review.");
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
      const response = await fetch(`http://localhost:5000/lessons/${id}/comments`, {
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
    <div className="max-w-5xl mx-auto p-4 md:p-10 space-y-8 text-slate-100">
      
      {/* 1. Main Content Section */}
      <article className="border border-slate-800 bg-slate-900/30 backdrop-blur-md rounded-3xl p-6 md:p-10 space-y-6">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 text-xs font-bold bg-blue-950/60 text-blue-400 border border-blue-900/50 rounded-full">
            {lesson.category}
          </span>
          <span className="px-3 py-1 text-xs font-bold bg-purple-950/60 text-purple-400 border border-purple-900/50 rounded-full">
            🎭 {lesson.emotionalTone}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight break-all">
          {lesson.title}
        </h1>

        {/* Dynamic Static Metric Value Calculations */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-medium py-2 border-y border-slate-800/60">
          <div>Published: <span className="text-slate-200">{new Date(lesson.createdDate).toLocaleDateString()}</span></div>
          {lesson.lastUpdatedDate && (
            <div>Updated: <span className="text-slate-200">{new Date(lesson.lastUpdatedDate).toLocaleDateString()}</span></div>
          )}
          <div className="capitalize">Tier: <span className="text-emerald-400 font-bold">{lesson.accessLevelBadge}</span></div>
          <div>⏱️ Reading Time: <span className="text-slate-200">{Math.ceil(lesson.description.split(' ').length / 200)} min</span></div>
          <div>👀 Impression Count: <span className="text-slate-200 font-mono">{lesson.viewsCount}</span></div>
        </div>

        {lesson.featuredImage && (
          <div className="relative h-[250px] md:h-[450px] w-full rounded-2xl overflow-hidden border border-slate-800">
            <Image src={lesson.featuredImage} alt={lesson.title} className="object-cover" fill priority />
          </div>
        )}

        <p className="text-base md:text-lg text-slate-300 leading-relaxed whitespace-pre-wrap font-normal break-all">
          {lesson.description}
        </p>

        {/* 5. User Interaction Command Toolbar Row */}
        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-800/80">
          <Button color={isLiked ? "danger" : "default"} variant={isLiked ? "flat" : "bordered"} className="font-bold rounded-xl" onClick={handleLikeToggle}>
            ❤️ {isLiked ? "Liked" : "Like"} ({lesson.likesCount})
          </Button>

          <Button color={isSaved ? "warning" : "default"} variant={isSaved ? "flat" : "bordered"} className="font-bold rounded-xl" onClick={handleSaveToggle}>
            🔖 {isSaved ? "Saved to Collection" : "Save to Favorites"}
          </Button>

          <Button color="danger" variant="light" className="font-medium rounded-xl ml-auto text-xs" onClick={onOpen}>
            🚩 Flag Content
          </Button>
        </div>
      </article>

      {/* 3. Dedicated Creator Author Summary Card block */}
      <Card className="border border-slate-800 bg-slate-900/50 p-6 rounded-2xl shadow-sm">
        {/* FIXED: Changed CardContent to CardContent */}
        <CardContent className="flex flex-col sm:flex-row items-center gap-5 justify-between">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Avatar 
              src={lesson.creatorImage} 
              className="w-14 h-14 border border-slate-700 shrink-0" 
            />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Created By</span>
              <h3 className="text-lg font-bold text-white">{lesson.creatorName}</h3>
              <p className="text-xs text-slate-400">Contributor Account Reference: {lesson.creatorEmail}</p>
            </div>
          </div>
          <Button 
            color="primary" 
            variant="flat" 
            className="w-full sm:w-auto font-bold rounded-xl"
            onClick={() => router.push(`/dashboard/authors/${encodeURIComponent(lesson.creatorEmail)}`)}
          >
            Explore Author Profile
          </Button>
        </CardContent>
      </Card>

      {/* 6. Comprehensive Comments Processing Section Engine */}
      <section className="space-y-6 pt-4">
        <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          🗣️ Community Discussion ({comments.length})
        </h3>

        {currentUser ? (
          <form onSubmit={handlePostComment} className="space-y-3">
            {/* FIXED: Changed TextArea to correct TextArea tag */}
            <TextArea
              variant="bordered"
              placeholder="Share your thoughts, experiences, or alternative realizations regarding this milestone..."
              className="text-white"
              classNames={{ input: "placeholder:text-slate-500" }}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <Button type="submit" color="primary" className="font-bold rounded-xl px-6">
              Post Comment
            </Button>
          </form>
        ) : (
          <div className="p-4 bg-slate-900/20 border border-slate-800 rounded-xl text-sm text-slate-400 text-center">
            Please register or sign in to participate in the conversation stream.
          </div>
        )}

        <div className="space-y-4 mt-6">
          {comments.map((comment) => (
            <div key={comment._id} className="p-4 border border-slate-800 bg-slate-900/10 rounded-xl flex gap-3 items-start">
              <Avatar src={comment.userImage} size="sm" className="mt-0.5 border border-slate-800" />
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-slate-200 truncate">{comment.userName}</span>
                  <span className="text-[10px] text-slate-500 font-medium font-mono shrink-0">
                    {new Date(comment.createdDate).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{comment.text}</p>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-center py-6 text-sm text-slate-500">No input observations noted yet. Be the first to start the discussion!</p>
          )}
        </div>
      </section>

      {/* Flag Report Flow Modal Component Context Integration */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" className="bg-slate-950 border border-slate-800 text-white rounded-2xl">
        {/* FIXED: Swapped ModalContainer to correct ModalContainer */}
        <ModalContainer>
          {(onClose) => (
            <>
              <ModalHeader className="font-extrabold text-xl text-white">Flag Content Review Request</ModalHeader>
              <ModalBody className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Help support network verification systems. Please detail the operational compliance collision seen under this file index.
                </p>
                <Select 
                  label="Primary Infraction Reason" 
                  className="w-full text-white" 
                  variant="bordered"
                  selectedKeys={reportReason ? [reportReason] : []}
                  onChange={(e) => setReportReason(e.target.value)}
                >
                  {/* FIXED: Swapped SelectValue inside the drop-down elements back to SelectValue */}
                  <SelectValue key="misinformation" textValue="Misinformation">Misinformation / False Insights</SelectValue>
                  <SelectValue key="plagiarism" textValue="Plagiarism">Plagiarism / Uncredited Asset Capture</SelectValue>
                  <SelectValue key="inappropriate" textValue="Inappropriate content">Inappropriate / Harmful Language</SelectValue>
                  <SelectValue key="other" textValue="Other reasons">Other Policy Contraventions</SelectValue>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="flat" className="rounded-xl font-bold" onClick={onClose}>
                  Cancel
                </Button>
                <Button color="danger" className="rounded-xl font-bold" disabled={!reportReason} onClick={() => handleReportSubmit(onClose)}>
                  Submit Infraction Request
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContainer>
      </Modal>

    </div>
  );
}