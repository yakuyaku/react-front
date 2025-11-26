'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PostCreateRequest } from '@/types/post';
import { FileUploadResponse } from '@/types/file';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import FileUpload from '@/components/files/FileUpload';
import Link from 'next/link';

export default function NewPostPage() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResponse[]>([]);
  const [formData, setFormData] = useState<PostCreateRequest>({
    title: '',
    content: '',
    is_pinned: false,
  });

  const handleFileUploadSuccess = (files: FileUploadResponse[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleFileUploadError = (errorMsg: string) => {
    setError(errorMsg);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('You must be logged in to create a post');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Create the post
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create post');
      }

      const data = await response.json();
      const postId = data.id;

      // Step 2: Attach files if any
      if (uploadedFiles.length > 0) {
        const fileIds = uploadedFiles.map(f => f.id);

        const attachResponse = await fetch(`/api/files/posts/${postId}/attach`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ file_ids: fileIds }),
        });

        if (!attachResponse.ok) {
          console.error('Failed to attach files, but post was created');
        }
      }

      router.push(`/dashboard/posts/${postId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/posts">
          <Button variant="secondary" className="mb-4">
            ← Back to Posts
          </Button>
        </Link>
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Create New Post
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Write a new post for the community
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
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter post title"
              maxLength={200}
              required
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {formData.title.length}/200 characters
            </p>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={formData.content}
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

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Attachments
            </label>
            <FileUpload
              onUploadSuccess={handleFileUploadSuccess}
              onUploadError={handleFileUploadError}
              multiple={true}
              isPublic={true}
              isTemp={true}
              maxSizeMB={50}
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Upload images, documents, or other files (max 10 files, 50MB each)
            </p>
          </div>

          {user?.is_admin && (
            <div className="flex items-center gap-3">
              <input
                id="is_pinned"
                type="checkbox"
                checked={formData.is_pinned}
                onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
              <label htmlFor="is_pinned" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Pin this post (Admin only)
              </label>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Link href="/dashboard/posts">
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </Link>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Post'}
          </Button>
        </div>
      </form>
    </div>
  );
}
