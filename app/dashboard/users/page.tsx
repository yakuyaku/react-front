'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserListResponse } from '@/types/user';
import UserTable from '@/components/users/UserTable';

export default function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<UserListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, token]);

  const fetchUsers = async (page: number) => {
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/users?page=${page}&page_size=${pageSize}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch users');
      }

      const data: UserListResponse = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Users
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Manage and view all users in the system
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <UserTable
        users={users?.users || []}
        loading={loading}
        currentPage={currentPage}
        totalPages={users?.total_pages || 1}
        onPageChange={handlePageChange}
      />

      {users && (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          Showing {users.users.length} of {users.total} users
        </div>
      )}
    </div>
  );
}
