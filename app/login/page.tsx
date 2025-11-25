'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import Loading from '@/components/ui/Loading';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard/users');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            Welcome Back
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Sign in to access the dashboard
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
