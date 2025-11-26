'use client';

import React, { useEffect, useState } from 'react';
import { PostAttachmentResponse } from '@/types/file';

interface AttachmentListProps {
  postId: number;
}

export default function AttachmentList({ postId }: AttachmentListProps) {
  const [attachments, setAttachments] = useState<PostAttachmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAttachments();
  }, [postId]);

  const fetchAttachments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/files/posts/${postId}/attachments`);

      if (!response.ok) {
        throw new Error('Failed to fetch attachments');
      }

      const data = await response.json();
      setAttachments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📽️';
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) return '📦';
    return '📎';
  };

  if (loading) {
    return (
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        Loading attachments...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600 dark:text-red-400">
        Error: {error}
      </div>
    );
  }

  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Attachments ({attachments.length})
      </h3>
      <div className="grid gap-3">
        {attachments.map((attachment) => {
          const file = attachment.file;
          if (!file) return null;

          const isImage = file.mime_type.startsWith('image/');

          return (
            <div
              key={attachment.id}
              className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{getFileIcon(file.mime_type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {file.original_filename}
                    </p>
                    {attachment.is_thumbnail && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        Thumbnail
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                    {formatFileSize(file.file_size)} • {file.mime_type}
                  </p>
                  {isImage && (
                    <div className="mt-3">
                      <img
                        src={`http://localhost:8000${file.file_path}`}
                        alt={file.original_filename}
                        className="max-w-full h-auto rounded-lg border border-zinc-200 dark:border-zinc-700"
                        style={{ maxHeight: '400px' }}
                      />
                    </div>
                  )}
                </div>
                <a
                  href={`http://localhost:8000/api/v1/files/${file.id}/download`}
                  download
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium whitespace-nowrap"
                >
                  Download
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { AttachmentList };
