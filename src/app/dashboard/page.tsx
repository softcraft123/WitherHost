'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { Announcements } from '@/components/announcements';

interface Server {
  id: string;
  name: string;
  region: string;
  status: 'online' | 'offline';
  players: number;
  maxPlayers: number;
}

interface UserStats {
  totalServers: number;
  activeServers: number;
  totalPlayers: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [servers, setServers] = useState<Server[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalServers: 0,
    activeServers: 0,
    totalPlayers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch user document
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        // Fetch servers
        if (userData?.servers && userData.servers.length > 0) {
          const serverIds = userData.servers;
          const serverDocs = await Promise.all(
            serverIds.map(id => getDoc(doc(db, 'servers', id)))
          );

          const serversData = serverDocs
            .filter(doc => doc.exists())
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
            } as Server));

          setServers(serversData);

          // Calculate stats
          const activeServers = serversData.filter(s => s.status === 'online').length;
          const totalPlayers = serversData.reduce((sum, s) => sum + s.players, 0);

          setStats({
            totalServers: serversData.length,
            activeServers,
            totalPlayers,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-muted">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user?.displayName}!</h1>
          <p className="text-muted">Manage your Minecraft servers from here</p>
        </div>

        {/* Announcements */}
        <Announcements />

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <div className="text-sm text-muted mb-2">Total Servers</div>
            <div className="text-4xl font-bold">{stats.totalServers}</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <div className="text-sm text-muted mb-2">Active Servers</div>
            <div className="text-4xl font-bold text-accent">{stats.activeServers}</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <div className="text-sm text-muted mb-2">Total Players</div>
            <div className="text-4xl font-bold text-secondary">{stats.totalPlayers}</div>
          </div>
        </div>

        {/* Servers Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Your Servers</h2>
            <Link
              href="/servers/create"
              className="px-4 py-2 bg-primary hover:bg-primary-dark rounded transition"
            >
              Create Server
            </Link>
          </div>

          {servers.length === 0 ? (
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 text-center">
              <p className="text-muted mb-4">No servers yet</p>
              <Link
                href="/servers/create"
                className="text-primary hover:text-primary-dark"
              >
                Create your first server
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {servers.map(server => (
                <div
                  key={server.id}
                  className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{server.name}</h3>
                      <p className="text-sm text-muted">{server.region}</p>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        server.status === 'online' ? 'bg-accent' : 'bg-gray-600'
                      }`}
                    />
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-muted mb-1">Players</p>
                    <p className="text-lg font-semibold">
                      {server.players}/{server.maxPlayers}
                    </p>
                  </div>
                  <Link
                    href={`/servers/${server.id}`}
                    className="text-primary hover:text-primary-dark text-sm"
                  >
                    Manage →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
