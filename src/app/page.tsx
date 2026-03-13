'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push('/dashboard');
      }
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
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold mb-4">WitherHost</h1>
        <p className="text-2xl text-muted mb-12">
          Easy and powerful Minecraft server hosting
        </p>

        <div className="flex gap-4 justify-center mb-20">
          <Link
            href="/login"
            className="px-8 py-3 bg-primary hover:bg-primary-dark rounded-lg font-medium transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 border border-primary text-primary hover:bg-primary/10 rounded-lg font-medium transition"
          >
            Register
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Fast & Reliable</h3>
            <p className="text-muted">
              High-performance servers with 99.9% uptime guarantee
            </p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold mb-2">Easy Management</h3>
            <p className="text-muted">
              Simple web interface to manage all your servers
            </p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-bold mb-2">Global Coverage</h3>
            <p className="text-muted">
              Servers in multiple regions for low latency
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
