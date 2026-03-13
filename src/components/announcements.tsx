'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  createdAt: any;
}

export function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'announcements'),
      orderBy('createdAt', 'desc'),
      limit(3)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Announcement));
      setAnnouncements(data);
    });

    return () => unsubscribe();
  }, []);

  if (announcements.length === 0) return null;

  return (
    <div className="space-y-3 mb-8">
      {announcements.map(announcement => (
        <div
          key={announcement.id}
          className={`border-l-4 p-4 rounded ${
            announcement.type === 'success'
              ? 'bg-accent/10 border-accent text-accent'
              : announcement.type === 'warning'
                ? 'bg-yellow-500/10 border-yellow-500 text-yellow-400'
                : 'bg-blue-500/10 border-blue-500 text-blue-400'
          }`}
        >
          <p className="font-semibold">{announcement.title}</p>
          <p className="text-sm mt-1">{announcement.message}</p>
        </div>
      ))}
    </div>
  );
}
