'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Button, Avatar } from '@heroui/react';

import { getSession } from '@/actions/session';
import { serverMutation } from '@/lib/serverMutation';

const categories = [
  'Personal Growth',
  'Career',
  'Relationships',
  'Mindset',
  'Mistakes Learned'
];

const emotionalTones = [
  'Motivational',
  'Sad',
  'Realization',
  'Gratitude',
  'Inspiring'
];

export default function AddLesson() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  // Form Controlled States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tone, setTone] = useState('');

  useEffect(() => {
    async function loadSession() {
      try {
        const session = await getSession();
        const userData = session?.user || session?.session?.user;

        if (!userData) {
          toast.error('Please login first');
          router.push('/login');
          return;
        }

        setUser(userData);
      } catch (error) {
        console.error(error);
        toast.error('Session check failed');
      } finally {
        setCheckingAuth(false);
      }
    }

    loadSession();
  }, [router]);

  async function onSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !category || !tone) {
      toast.error('Please fill all fields');
      return;
    }

    if (!user?.email) {
      toast.error('User session missing');
      return;
    }

    setLoading(true);

    const payload = {
      title,
      description,
      category,
      emotionalTone: tone,
      createdDate: new Date(),
      lastUpdatedDate: new Date(),
      visibility: 'Public',
      accessLevelBadge: 'Public',
      creatorName: user?.name || 'Anonymous',
      creatorEmail: user.email,
      creatorImage: user?.image || '',
      likes: [],
      likesCount: 0,
      favoritesCount: 0,
      viewsCount: 0
    };

    try {
      // Send data to backend API via server wrapper handler
      await serverMutation('/dashboard/add-lesson', payload);
      
      // ✅ Show success message first
      toast.success('Lesson published successfully');
      
      // ✅ Use a slight delay to allow React-Toastify to safely mount the alert 
      // into global memory context before the page unmounts and changes router paths.
      setTimeout(() => {
        router.push('/dashboard');
      }, 100);

    } catch (error) {
      console.error('Submission Error:', error);
      
      // ✅ Explicitly target and extract backend custom rejection text strings if they exist
      const errorMessage = error instanceof Error ? error.message : 'Failed to publish';
      toast.error(`Submission Failure: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }

  if (checkingAuth) {
    return <div className="flex justify-center p-10 font-medium text-gray-500">Verifying session...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Publish Lesson</h1>
      <p className="text-gray-500 mb-8">Share your experience</p>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Lesson Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Write title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-xl p-3 focus:border-blue-500 focus:outline-none bg-white text-black"
            required
          />
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="Write your lesson in detail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={10}
            className="w-full border-2 border-gray-300 rounded-xl p-4 focus:border-blue-500 focus:outline-none resize-y min-h-[200px] bg-white text-black"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Category Dropdown */}
          <div>
            <label className="block mb-2 font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded-xl p-3 bg-white text-black"
            >
              <option value="">Select category</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Tone Dropdown */}
          <div>
            <label className="block mb-2 font-medium">Emotional Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full border rounded-xl p-3 bg-white text-black"
            >
              <option value="">Select tone</option>
              {emotionalTones.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Identity Badge */}
        <div className="border rounded-xl p-4 flex items-center gap-4 bg-gray-50">
          <Avatar src={user?.image} name={user?.name} />
          <div>
            <p className="font-semibold text-black">{user?.name || 'Anonymous'}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <Button
          type="submit"
          color="primary"
          isLoading={loading}
          className="w-full font-semibold"
        >
          Publish Lesson
        </Button>
      </form>
    </div>
  );
}