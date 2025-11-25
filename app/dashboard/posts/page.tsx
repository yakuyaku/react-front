'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PostListResponse } from '@/types/post';
import PostTable from '@/components/posts/PostTable';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function PostsPage() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<PostListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage, token]);

  const fetchPosts = async (page: number) => {
    setLoading(true);
    setError('');

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `/api/posts?page=${page}&page_size=${pageSize}&sort_by=created_at&sort_order=desc`,
        { headers }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch posts');
      }

      const data: PostListResponse = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (postId: number) => {
    if (!token) return;

    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}?hard_delete=false`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete post');
      }

      fetchPosts(currentPage);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete post');
      console.error('Error deleting post:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Posts
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Manage and view all posts in the system
          </p>
        </div>
        <Link href="/dashboard/posts/new">
          <Button variant="primary">
            Create Post
          </Button>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <PostTable
        posts={posts?.posts || []}
        loading={loading}
        currentPage={currentPage}
        totalPages={posts?.total_pages || 1}
        onPageChange={handlePageChange}
        onDelete={handleDelete}
      />

      {posts && (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          Showing {posts.posts.length} of {posts.total} posts
        </div>
      )}
    </div>
  );
}
