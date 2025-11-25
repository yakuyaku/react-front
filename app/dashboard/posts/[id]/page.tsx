'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Post } from '@/types/post';
import Button from '@/components/ui/Button';
import Loading from '@/components/ui/Loading';
import Link from 'next/link';

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { token, user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

      const response = await fetch(`/api/posts/${resolvedParams.id}`, { headers });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch post');
      }

      const data: Post = await response.json();
      setPost(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load post');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!token) return;

    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${resolvedParams.id}?hard_delete=false`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete post');
      }

      router.push('/dashboard/posts');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete post');
      console.error('Error deleting post:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loading size="lg" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error || 'Post not found'}</p>
        </div>
        <Link href="/dashboard/posts">
          <Button variant="secondary">Back to Posts</Button>
        </Link>
      </div>
    );
  }

  const canEdit = user?.is_admin || user?.id === post.author_id;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Link href="/dashboard/posts">
            <Button variant="secondary" className="mb-4">
              ← Back to Posts
            </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          {canEdit && !post.is_deleted && (
            <>
              <Link href={`/dashboard/posts/${post.id}/edit`}>
                <Button variant="primary">Edit Post</Button>
              </Link>
              <Button
                variant="secondary"
                onClick={handleDelete}
                className="!text-red-600 dark:!text-red-400 hover:!bg-red-50 dark:hover:!bg-red-900/20"
              >
                Delete Post
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {post.is_pinned && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                    📌 Pinned
                  </span>
                )}
                {post.is_locked && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                    🔒 Locked
                  </span>
                )}
                {post.is_deleted && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                    Deleted
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                {post.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="font-medium">Author:</span>
              <span>{post.author_username || `User #${post.author_id}`}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>👁️ {post.view_count.toLocaleString()} views</span>
            </div>
            <div className="flex items-center gap-2">
              <span>❤️ {post.like_count.toLocaleString()} likes</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📅 {new Date(post.created_at).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-zinc-900 dark:text-zinc-100">
              {post.content}
            </div>
          </div>
        </div>

        {post.updated_at && (
          <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Last updated: {new Date(post.updated_at).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
