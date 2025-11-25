'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Post, PostUpdateRequest } from '@/types/post';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Loading from '@/components/ui/Loading';
import Link from 'next/link';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { token, user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<PostUpdateRequest>({
    title: '',
    content: '',
    is_pinned: false,
    is_locked: false,
  });

  useEffect(() => {
    fetchPost();
  }, [resolvedParams.id, token]);

  const fetchPost = async () => {
    setLoading(true);
    setError('');

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/posts/${resolvedParams.id}?increment_view=false`, { headers });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch post');
      }

      const data: Post = await response.json();
      setPost(data);
      setFormData({
        title: data.title,
        content: data.content,
        is_pinned: data.is_pinned,
        is_locked: data.is_locked,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load post');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('You must be logged in to edit a post');
      return;
    }

    if (!formData.title?.trim() || !formData.content?.trim()) {
      setError('Title and content are required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`/api/posts/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update post');
      }

      router.push(`/dashboard/posts/${resolvedParams.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
      console.error('Error updating post:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loading size="lg" />
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
        <Link href="/dashboard/posts">
          <Button variant="secondary">Back to Posts</Button>
        </Link>
      </div>
    );
  }

  const canEdit = user?.is_admin || user?.id === post?.author_id;

  if (!canEdit) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">
            You don't have permission to edit this post
          </p>
        </div>
        <Link href={`/dashboard/posts/${resolvedParams.id}`}>
          <Button variant="secondary">Back to Post</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/dashboard/posts/${resolvedParams.id}`}>
          <Button variant="secondary" className="mb-4">
            ← Back to Post
          </Button>
        </Link>
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Edit Post
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Update your post content
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Title
            </label>
            <Input
              id="title"
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter post title"
              maxLength={200}
              required
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {(formData.title?.length || 0)}/200 characters
            </p>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your post content here..."
              rows={15}
              required
              className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Write detailed content for your post
            </p>
          </div>

          {user?.is_admin && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  id="is_pinned"
                  type="checkbox"
                  checked={formData.is_pinned || false}
                  onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                />
                <label htmlFor="is_pinned" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Pin this post (Admin only)
                </label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="is_locked"
                  type="checkbox"
                  checked={formData.is_locked || false}
                  onChange={(e) => setFormData({ ...formData, is_locked: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                />
                <label htmlFor="is_locked" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Lock this post (Admin only)
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Link href={`/dashboard/posts/${resolvedParams.id}`}>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </Link>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
