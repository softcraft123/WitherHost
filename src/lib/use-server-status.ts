'use client';

import { useEffect, useState } from 'react';
import { db } from './firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface ServerStatus {
  status: 'online' | 'offline';
  players: number;
  maxPlayers: number;
  uptime: number;
}

export function useServerStatus(serverId: string) {
  const [data, setData] = useState<ServerStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!serverId) return;

    const unsubscribe = onSnapshot(
      doc(db, 'servers', serverId),
      (doc) => {
        if (doc.exists()) {
          const serverData = doc.data();
          setData({
            status: serverData.status || 'offline',
            players: serverData.players || 0,
            maxPlayers: serverData.maxPlayers || 0,
            uptime: serverData.uptime || 0,
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to server:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [serverId]);

  return { data, loading };
}
