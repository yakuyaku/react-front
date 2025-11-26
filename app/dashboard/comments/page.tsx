'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CommentList from '@/components/comments/CommentList';
import { Post, PostListResponse } from '@/types/post';
import { getToken } from '@/lib/auth';

export default function CommentsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/posts?page=1&page_size=50', {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data: PostListResponse = await response.json();
      setPosts(data.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (postId: number) => {
    setSelectedPostId(postId);
  };

  const handleBack = () => {
    setSelectedPostId(null);
  };

  if (selectedPostId) {
    const selectedPost = posts.find(p => p.id === selectedPostId);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            ← Back to Posts
          </button>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {selectedPost?.title || `Post #${selectedPostId}`}
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Comments for this post
          </p>
        </div>

        {user && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Logged in as: <strong>{user.username}</strong> (ID: {user.id})
              {user.is_admin && ' - Admin'}
            </p>
          </div>
        )}

        {!user && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-300">
              You are not logged in. Log in to create, edit, or delete comments.
            </p>
          </div>
        )}

        <CommentList
          postId={selectedPostId}
          currentUserId={user?.id}
          isAdmin={user?.is_admin || false}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Comments
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Select a post to view and manage comments
        </p>
      </div>

      {user && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Logged in as: <strong>{user.username}</strong> (ID: {user.id})
            {user.is_admin && ' - Admin'}
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center text-zinc-600 dark:text-zinc-400">
            Loading posts...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 dark:text-red-400">
            Error: {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-zinc-600 dark:text-zinc-400">
            No posts found
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {posts.map((post) => (
              <button
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                className="w-full text-left p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {post.is_pinned && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          Pinned
                        </span>
                      )}
                      {post.is_locked && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300">
                          Locked
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500">
                      <span>By {post.author_username || `User ${post.author_id}`}</span>
                      <span>•</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{post.view_count} views</span>
                      <span>•</span>
                      <span>{post.like_count} likes</span>
                    </div>
                  </div>
                  <div className="text-zinc-400 dark:text-zinc-600">
                    →
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
