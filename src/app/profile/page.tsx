'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

interface UserProfile {
  username: string;
  email: string;
  servers: string[];
  createdAt: any;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          setProfile(data);
          setDisplayName(data.username || user.displayName || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleUpdateProfile = async () => {
    if (!user || !displayName.trim()) return;

    setUpdating(true);

    try {
      await updateProfile(user, { displayName });
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
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

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-12">Profile</h1>

        {/* User Info Card */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8 mb-8">
          <div className="mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-3xl font-bold mb-4">
              {displayName.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <p className="text-sm text-muted mb-1">Display Name</p>
              {editing ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded text-white focus:outline-none focus:border-primary"
                />
              ) : (
                <p className="text-xl font-semibold">{displayName || 'No name set'}</p>
              )}
            </div>

            <div>
              <p className="text-sm text-muted mb-1">Email</p>
              <p className="text-lg">{user?.email}</p>
            </div>

            {profile && (
              <>
                <div>
                  <p className="text-sm text-muted mb-1">Total Servers</p>
                  <p className="text-lg font-semibold">{profile.servers?.length || 0}</p>
                </div>

                <div>
                  <p className="text-sm text-muted mb-1">Member Since</p>
                  <p className="text-lg">
                    {profile.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3">
            {editing ? (
              <>
                <button
                  onClick={handleUpdateProfile}
                  disabled={updating}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark disabled:bg-gray-700 rounded transition"
                >
                  {updating ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Account Security</h2>
          <div className="space-y-4">
            <p className="text-muted">
              Password changes and advanced security options are coming soon.
            </p>
            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition disabled:opacity-50 cursor-not-allowed">
              Change Password (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
