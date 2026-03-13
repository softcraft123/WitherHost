'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import Link from 'next/link';

interface Server {
  id: string;
  name: string;
  region: string;
  status: 'online' | 'offline';
  players: number;
  maxPlayers: number;
  version: string;
  uptime: number;
  createdAt: any;
  ownerId: string;
}

export default function ServerDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const serverId = params.id as string;
  const [server, setServer] = useState<Server | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'files'>('overview');

  useEffect(() => {
    if (!serverId || !user) return;

    const unsubscribe = onSnapshot(
      doc(db, 'servers', serverId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data.ownerId === user.uid) {
            setServer({
              id: doc.id,
              ...data,
            } as Server);
            setLoading(false);
          }
        }
      },
      (err) => {
        console.error('Error fetching server:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [serverId, user]);

  const toggleServerStatus = async () => {
    if (!server) return;
    setUpdating(true);
    setError('');

    try {
      const newStatus = server.status === 'online' ? 'offline' : 'online';
      await updateDoc(doc(db, 'servers', serverId), {
        status: newStatus,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to update server');
    } finally {
      setUpdating(false);
    }
  };

  const deleteServer = async () => {
    if (!confirm('Are you sure you want to delete this server?')) return;

    setUpdating(true);
    setError('');

    try {
      // Delete server document
      await updateDoc(doc(db, 'servers', serverId), {
        deleted: true,
        deletedAt: new Date(),
      });

      // Remove from user's servers
      const userRef = doc(db, 'users', user!.uid);
      const userDoc = await getDoc(userRef);
      const currentServers = userDoc.data()?.servers || [];
      await updateDoc(userRef, {
        servers: currentServers.filter((id: string) => id !== serverId),
      });

      window.location.href = '/servers';
    } catch (err: any) {
      setError(err.message || 'Failed to delete server');
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
          <div className="text-lg text-muted">Loading...</div>
        </div>
      </main>
    );
  }

  if (!server) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Server not found</h1>
            <Link href="/servers" className="text-primary hover:text-primary-dark">
              Back to servers
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <Link href="/servers" className="text-primary hover:text-primary-dark mb-6 inline-block">
          ← Back to Servers
        </Link>

        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{server.name}</h1>
              <p className="text-muted">{server.region}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleServerStatus}
                disabled={updating}
                className={`px-4 py-2 rounded transition font-medium ${
                  server.status === 'online'
                    ? 'bg-accent hover:bg-accent text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {updating ? 'Updating...' : server.status === 'online' ? 'Stop' : 'Start'}
              </button>
              <button
                onClick={deleteServer}
                disabled={updating}
                className="px-4 py-2 bg-destructive hover:bg-red-600 rounded transition font-medium disabled:bg-gray-700"
              >
                Delete
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700 rounded text-red-200 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Server Status Card */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <div className="text-sm text-muted mb-2">Status</div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  server.status === 'online' ? 'bg-accent' : 'bg-gray-600'
                }`}
              />
              <span className="text-lg font-semibold capitalize">{server.status}</span>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <div className="text-sm text-muted mb-2">Players Online</div>
            <div className="text-2xl font-bold">
              {server.players}/{server.maxPlayers}
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <div className="text-sm text-muted mb-2">Uptime</div>
            <div className="text-2xl font-bold">{server.uptime}%</div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
            <div className="text-sm text-muted mb-2">Version</div>
            <div className="text-lg font-semibold">{server.version}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'overview'
                  ? 'bg-gray-800 text-primary border-b-2 border-primary'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'logs'
                  ? 'bg-gray-800 text-primary border-b-2 border-primary'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Logs
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`flex-1 px-6 py-4 font-medium transition ${
                activeTab === 'files'
                  ? 'bg-gray-800 text-primary border-b-2 border-primary'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              Files
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-bold mb-4">Server Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted">Server ID:</span>
                    <span className="font-mono text-sm">{server.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Region:</span>
                    <span>{server.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Version:</span>
                    <span>{server.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Created:</span>
                    <span>
                      {server.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'logs' && (
              <div>
                <h3 className="text-lg font-bold mb-4">Server Logs</h3>
                <div className="bg-black rounded p-4 font-mono text-sm text-green-400 h-64 overflow-y-auto">
                  <p>[12:34:56] Server started successfully</p>
                  <p>[12:35:01] Player joined: Player1</p>
                  <p>[12:35:45] Player joined: Player2</p>
                  <p className="text-muted">{'>>'} Waiting for more logs...</p>
                </div>
              </div>
            )}

            {activeTab === 'files' && (
              <div>
                <h3 className="text-lg font-bold mb-4">Server Files</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <span>server.properties</span>
                    <button className="text-primary hover:text-primary-dark text-sm">
                      Edit
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-800 rounded">
                    <span>world/</span>
                    <button className="text-primary hover:text-primary-dark text-sm">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
