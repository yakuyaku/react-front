'use client';

import React, { useState, useEffect } from 'react';
import { Comment, CommentTreeResponse, CommentListResponse, CommentTreeListResponse } from '@/types/comment';
import Button from '@/components/ui/Button';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { getToken } from '@/lib/auth';

interface CommentListProps {
  postId: number;
  currentUserId?: number;
  isAdmin?: boolean;
}

type ViewMode = 'flat' | 'tree';

export default function CommentList({ postId, currentUserId, isAdmin = false }: CommentListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('tree');
  const [comments, setComments] = useState<Comment[] | CommentTreeResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchComments = async () => {
    setLoading(true);
    setError('');

    try {
      const endpoint = viewMode === 'flat'
        ? `/api/comments/posts/${postId}/flat`
        : `/api/comments/posts/${postId}/tree`;

      const token = getToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, { headers });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to fetch comments');
      }

      const data: CommentListResponse | CommentTreeListResponse = await response.json();
      setComments(data.comments);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId, viewMode]);

  const handleCreateComment = async (content: string) => {
    const token = getToken();
    if (!token) {
      throw new Error('You must be logged in to comment');
    }

    const response = await fetch(`/api/comments/posts/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to create comment');
    }

    await fetchComments();
  };

  const handleReply = async (parentId: number, content: string) => {
    const token = getToken();
    if (!token) {
      throw new Error('You must be logged in to reply');
    }

    const response = await fetch(`/api/comments/posts/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content, parent_id: parentId }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to create reply');
    }

    await fetchComments();
  };

  const handleEdit = async (commentId: number, content: string) => {
    const token = getToken();
    if (!token) {
      throw new Error('You must be logged in to edit');
    }

    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to update comment');
    }

    await fetchComments();
  };

  const handleDelete = async (commentId: number) => {
    const token = getToken();
    if (!token) {
      throw new Error('You must be logged in to delete');
    }

    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || 'Failed to delete comment');
    }

    await fetchComments();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Comments ({total})
        </h2>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'flat' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('flat')}
            className="!h-9 !px-4 !text-sm"
          >
            Flat View
          </Button>
          <Button
            variant={viewMode === 'tree' ? 'primary' : 'secondary'}
            onClick={() => setViewMode('tree')}
            className="!h-9 !px-4 !text-sm"
          >
            Tree View
          </Button>
        </div>
      </div>

      {/* New Comment Form */}
      {currentUserId && (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-4">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
            Add a comment
          </h3>
          <CommentForm
            onSubmit={handleCreateComment}
            submitLabel="Post Comment"
            showCancel={false}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-8 text-center">
          <div className="inline-block w-8 h-8 border-3 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin" />
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading comments...</p>
        </div>
      )}

      {/* Comments List */}
      {!loading && comments.length === 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-8 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">No comments yet. Be the first to comment!</p>
        </div>
      )}

      {!loading && comments.length > 0 && (
        <div className="space-y-2">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isTree={viewMode === 'tree'}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
