'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (!user) return null;

  return (
    <nav className="bg-gray-900/80 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-bold">
          WitherHost
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          <Link
            href="/dashboard"
            className="text-muted hover:text-foreground transition"
          >
            Dashboard
          </Link>
          <Link
            href="/servers"
            className="text-muted hover:text-foreground transition"
          >
            Servers
          </Link>
          <Link
            href="/profile"
            className="text-muted hover:text-foreground transition"
          >
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-destructive hover:bg-red-600 rounded transition"
          >
            Logout
          </button>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 p-4 space-y-3">
          <Link
            href="/dashboard"
            className="block text-muted hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link href="/servers" className="block text-muted hover:text-foreground">
            Servers
          </Link>
          <Link href="/profile" className="block text-muted hover:text-foreground">
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-destructive hover:bg-red-600 rounded transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
