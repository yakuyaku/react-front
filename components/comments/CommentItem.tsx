'use client';

import React, { useState } from 'react';
import { Comment, CommentTreeResponse } from '@/types/comment';
import Button from '@/components/ui/Button';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: Comment | CommentTreeResponse;
  isTree?: boolean;
  onReply?: (parentId: number, content: string) => Promise<void>;
  onEdit?: (commentId: number, content: string) => Promise<void>;
  onDelete?: (commentId: number) => Promise<void>;
  currentUserId?: number;
  isAdmin?: boolean;
}

export default function CommentItem({
  comment,
  isTree = false,
  onReply,
  onEdit,
  onDelete,
  currentUserId,
  isAdmin = false,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = currentUserId === comment.author_id;
  const canEdit = isOwner || isAdmin;
  const canDelete = isOwner || isAdmin;

  const handleReply = async (content: string) => {
    if (onReply) {
      await onReply(comment.id, content);
      setIsReplying(false);
    }
  };

  const handleEdit = async (content: string) => {
    if (onEdit) {
      await onEdit(comment.id, content);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || isDeleting) return;

    if (confirm('Are you sure you want to delete this comment?')) {
      setIsDeleting(true);
      try {
        await onDelete(comment.id);
      } catch (error) {
        console.error('Delete failed:', error);
        setIsDeleting(false);
      }
    }
  };

  const depthColors = [
    'border-l-blue-500',
    'border-l-green-500',
    'border-l-purple-500',
    'border-l-orange-500',
  ];

  const children = 'children' in comment ? comment.children : null;

  return (
    <div className={`${comment.depth > 0 ? 'ml-8' : ''}`}>
      <div
        className={`
          bg-white dark:bg-zinc-900
          rounded-lg
          border-l-4
          ${depthColors[comment.depth % depthColors.length]}
          ${comment.is_deleted ? 'opacity-60' : ''}
          p-4 mb-3
          shadow-sm
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {comment.author_username || `User #${comment.author_id}`}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-500">
              {new Date(comment.created_at).toLocaleString()}
            </span>
            {comment.updated_at && (
              <span className="text-xs text-zinc-400 dark:text-zinc-600 italic">
                (edited)
              </span>
            )}
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              Depth {comment.depth}
            </span>
          </div>
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="mb-3">
            <CommentForm
              onSubmit={handleEdit}
              onCancel={() => setIsEditing(false)}
              initialValue={comment.content}
              submitLabel="Save"
            />
          </div>
        ) : (
          <div className="text-sm text-zinc-700 dark:text-zinc-300 mb-3 whitespace-pre-wrap">
            {comment.content}
          </div>
        )}

        {/* Actions */}
        {!comment.is_deleted && (
          <div className="flex gap-2">
            {onReply && comment.depth < 3 && !isReplying && (
              <Button
                variant="secondary"
                onClick={() => setIsReplying(true)}
                className="!h-7 !px-3 !text-xs"
              >
                Reply
              </Button>
            )}
            {canEdit && !isEditing && (
              <Button
                variant="secondary"
                onClick={() => setIsEditing(true)}
                className="!h-7 !px-3 !text-xs"
              >
                Edit
              </Button>
            )}
            {canDelete && (
              <Button
                variant="secondary"
                onClick={handleDelete}
                disabled={isDeleting}
                className="!h-7 !px-3 !text-xs !text-red-600 dark:!text-red-400 hover:!bg-red-50 dark:hover:!bg-red-900/20"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </div>
        )}

        {/* Reply Form */}
        {isReplying && (
          <div className="mt-3 pl-4 border-l-2 border-zinc-200 dark:border-zinc-700">
            <CommentForm
              onSubmit={handleReply}
              onCancel={() => setIsReplying(false)}
              placeholder="Write a reply..."
              submitLabel="Reply"
            />
          </div>
        )}
      </div>

      {/* Render children for tree structure */}
      {isTree && children && children.length > 0 && (
        <div className="ml-4">
          {children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              isTree={isTree}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
}
