'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-lg text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">WitherHost</h1>
          <p className="text-muted">Minecraft Server Hosting</p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6">Login</h2>
          <LoginForm />
        </div>

        <div className="text-center text-muted">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-primary hover:text-primary-dark">
            Register here
          </Link>
        </div>
      </div>
    </main>
  );
}
