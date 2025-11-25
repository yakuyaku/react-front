'use client';

import React from 'react';
import { Post } from '@/types/post';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface PostTableProps {
  posts: Post[];
  loading?: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete?: (postId: number) => void;
}

export default function PostTable({
  posts,
  loading = false,
  currentPage,
  totalPages,
  onPageChange,
  onDelete,
}: PostTableProps) {
  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <div className="inline-block w-8 h-8 border-3 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-zinc-100 rounded-full animate-spin" />
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading posts...</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow overflow-hidden">
        <div className="p-8 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">No posts found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Likes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <td className="px-6 py-4 text-sm text-zinc-900 dark:text-zinc-100">
                  <Link
                    href={`/dashboard/posts/${post.id}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 font-medium flex items-center gap-2"
                  >
                    {post.is_pinned && (
                      <span className="text-yellow-500" title="Pinned">
                        📌
                      </span>
                    )}
                    {post.is_locked && (
                      <span className="text-red-500" title="Locked">
                        🔒
                      </span>
                    )}
                    <span className="truncate max-w-md">{post.title}</span>
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                  {post.author_username || `User #${post.author_id}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                  {post.view_count.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                  {post.like_count.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {post.is_deleted ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                      Deleted
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400">
                  {new Date(post.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex justify-end gap-2">
                    <Link href={`/dashboard/posts/${post.id}`}>
                      <Button variant="secondary" className="!h-8 !px-3 !text-xs">
                        View
                      </Button>
                    </Link>
                    <Link href={`/dashboard/posts/${post.id}/edit`}>
                      <Button variant="secondary" className="!h-8 !px-3 !text-xs">
                        Edit
                      </Button>
                    </Link>
                    {onDelete && !post.is_deleted && (
                      <Button
                        variant="secondary"
                        onClick={() => onDelete(post.id)}
                        className="!h-8 !px-3 !text-xs !text-red-600 dark:!text-red-400 hover:!bg-red-50 dark:hover:!bg-red-900/20"
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="!h-10 !px-4"
            >
              Previous
            </Button>
            <Button
              variant="secondary"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="!h-10 !px-4"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
