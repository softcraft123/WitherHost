'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

interface Server {
  id: string;
  name: string;
  region: string;
  status: 'online' | 'offline';
  players: number;
  maxPlayers: number;
  uptime: number;
}

export default function ServersPage() {
  const { user } = useAuth();
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');

  useEffect(() => {
    if (!user) return;

    const fetchServers = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

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
        }
      } catch (error) {
        console.error('Error fetching servers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, [user]);

  const filteredServers = servers.filter(server => {
    if (filter === 'online') return server.status === 'online';
    if (filter === 'offline') return server.status === 'offline';
    return true;
  });

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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Servers</h1>
          <Link
            href="/servers/create"
            className="px-4 py-2 bg-primary hover:bg-primary-dark rounded transition"
          >
            New Server
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded transition ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-900 border border-gray-800 text-muted hover:border-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('online')}
            className={`px-4 py-2 rounded transition ${
              filter === 'online'
                ? 'bg-accent text-white'
                : 'bg-gray-900 border border-gray-800 text-muted hover:border-gray-700'
            }`}
          >
            Online
          </button>
          <button
            onClick={() => setFilter('offline')}
            className={`px-4 py-2 rounded transition ${
              filter === 'offline'
                ? 'bg-destructive text-white'
                : 'bg-gray-900 border border-gray-800 text-muted hover:border-gray-700'
            }`}
          >
            Offline
          </button>
        </div>

        {filteredServers.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-12 text-center">
            <p className="text-muted mb-4">No {filter !== 'all' ? filter : ''} servers found</p>
            <Link
              href="/servers/create"
              className="text-primary hover:text-primary-dark"
            >
              Create your first server
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredServers.map(server => (
              <Link
                key={server.id}
                href={`/servers/${server.id}`}
                className="block bg-gray-900/50 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{server.name}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          server.status === 'online'
                            ? 'bg-accent/20 text-accent'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {server.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted mb-3">{server.region}</p>
                    <div className="flex gap-8">
                      <div>
                        <p className="text-xs text-muted mb-1">Players</p>
                        <p className="font-semibold">
                          {server.players}/{server.maxPlayers}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted mb-1">Uptime</p>
                        <p className="font-semibold">{server.uptime}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-primary text-sm">Manage →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
