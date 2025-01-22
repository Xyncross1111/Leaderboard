'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import TeamCard from './TeamCard';
import io from 'socket.io-client';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function TeamLeaderboard() {
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const { data: teams, error, mutate } = useSWR('/api/teams', fetcher);
  const [socket, setSocket] = useState(null);
  const [socketError, setSocketError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const initSocket = async () => {
      try {
        // Initialize socket server
        await fetch('/api/socketio');
        
        if (!mounted) return;

        const newSocket = io({
          path: '/api/socketio',
          addTrailingSlash: false,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 20000,
        });

        newSocket.on('connect', () => {
          console.log('Socket connected:', newSocket.id);
          setSocketError(null);
        });

        newSocket.on('connect_error', (err) => {
          console.error('Socket connection error:', err);
          setSocketError('Unable to establish real-time connection');
        });

        newSocket.on('teamsUpdate', (updatedTeams) => {
          console.log('Teams updated via socket');
          mutate(updatedTeams, false);
        });

        setSocket(newSocket);

        return () => {
          console.log('Cleaning up socket connection');
          newSocket.close();
        };
      } catch (err) {
        console.error('Socket initialization error:', err);
        setSocketError('Failed to initialize real-time connection');
      }
    };

    initSocket();

    return () => {
      mounted = false;
      if (socket) {
        socket.close();
      }
    };
  }, [mutate]);

  if (error) return <div className="text-red-500">Error loading teams</div>;
  if (!teams) return <div className="animate-pulse">Loading...</div>;

  const filteredTeams = Array.isArray(teams) ? teams.filter(team => 
    team.name.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const updatePoints = async (teamId, newPoints) => {
    try {
      const res = await fetch(`/api/teams/${teamId}/points`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ points: newPoints })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update points');
      }

      mutate();
    } catch (error) {
      console.error('Error updating points:', error);
      alert(error.message || 'Failed to update points');
    }
  };

  const deleteTeam = async (teamId) => {
    if (!session?.user?.role === 'admin') return;
    
    if (!confirm('Are you sure you want to delete this team?')) return;

    try {
      const res = await fetch(`/api/teams/${teamId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete team');
      }

      mutate();
    } catch (error) {
      console.error('Error deleting team:', error);
      alert(error.message || 'Failed to delete team');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {socketError && (
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
          {socketError}
        </div>
      )}
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-card-border bg-card-bg text-text-primary focus:ring-2 focus:ring-accent-primary focus:border-transparent"
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTeams.map((team, index) => (
          <TeamCard
            key={team._id}
            team={team}
            position={index + 1}
            onUpdatePoints={updatePoints}
            onDeleteTeam={deleteTeam}
            isAdmin={session?.user?.role === 'admin'}
          />
        ))}
      </div>
    </div>
  );
}