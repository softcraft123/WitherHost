'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const regions = ['EUROPE', 'AMERICA', 'ASIA', 'LOCAL'];

export default function CreateServerPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    region: 'EUROPE',
    maxPlayers: 20,
    version: 'latest',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'maxPlayers' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!user) throw new Error('Not authenticated');

      // Create server document
      const serverRef = await addDoc(collection(db, 'servers'), {
        name: formData.name,
        region: formData.region,
        maxPlayers: formData.maxPlayers,
        version: formData.version,
        ownerId: user.uid,
        status: 'offline',
        players: 0,
        uptime: 0,
        createdAt: new Date(),
        logs: [],
        files: [],
      });

      // Add server to user's servers list
      await updateDoc(doc(db, 'users', user.uid), {
        servers: arrayUnion(serverRef.id),
      });

      router.push(`/servers/${serverRef.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/servers" className="text-primary hover:text-primary-dark mb-4 inline-block">
            ← Back to Servers
          </Link>
          <h1 className="text-4xl font-bold mb-2">Create New Server</h1>
          <p className="text-muted">Set up your new Minecraft server</p>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Server Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-primary"
                placeholder="My Awesome Server"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Region</label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-primary"
              >
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Max Players</label>
              <input
                type="number"
                name="maxPlayers"
                value={formData.maxPlayers}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-primary"
                min="1"
                max="100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Minecraft Version</label>
              <select
                name="version"
                value={formData.version}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-primary"
              >
                <option value="latest">Latest</option>
                <option value="1.20">1.20</option>
                <option value="1.19">1.19</option>
                <option value="1.18">1.18</option>
              </select>
            </div>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-primary hover:bg-primary-dark disabled:bg-gray-700 rounded font-medium transition"
            >
              {loading ? 'Creating Server...' : 'Create Server'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
