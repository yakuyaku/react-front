'use client';

import React, { useState } from 'react';
import Button from '@/components/ui/Button';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  onCancel?: () => void;
  initialValue?: string;
  placeholder?: string;
  submitLabel?: string;
  showCancel?: boolean;
}

export default function CommentForm({
  onSubmit,
  onCancel,
  initialValue = '',
  placeholder = 'Write a comment...',
  submitLabel = 'Submit',
  showCancel = true,
}: CommentFormProps) {
  const [content, setContent] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!content.trim()) {
      setError('Comment content is required');
      return;
    }

    if (content.length > 1000) {
      setError('Comment must be 1000 characters or less');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={3}
          maxLength={1000}
          disabled={isSubmitting}
          className="
            w-full px-3 py-2
            border border-zinc-300 dark:border-zinc-700
            rounded-lg
            bg-white dark:bg-zinc-800
            text-zinc-900 dark:text-zinc-100
            placeholder-zinc-400 dark:placeholder-zinc-600
            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600
            disabled:opacity-50 disabled:cursor-not-allowed
            text-sm
          "
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-zinc-500 dark:text-zinc-500">
            {content.length} / 1000
          </span>
          {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="!h-8 !px-4 !text-sm"
        >
          {isSubmitting ? 'Submitting...' : submitLabel}
        </Button>
        {showCancel && onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
            className="!h-8 !px-4 !text-sm"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
