'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import TeamCard from './TeamCard';
import LeaderboardStats from './LeaderboardStats';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function TeamLeaderboard() {
  const { data: session } = useSession();
  const [search, setSearch] = useState('');
  const { data: teams, error, mutate } = useSWR('/api/teams', fetcher, {
    refreshInterval: 5000
  });

  if (error) return <div>Error loading teams</div>;
  if (!teams) return <div>Loading...</div>;

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

      // Refresh the teams data
      mutate();
    } catch (error) {
      console.error('Error updating points:', error);
      alert(error.message || 'Failed to update points');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search teams..."
            className="w-full p-4 pr-12 rounded-lg border focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg
            className="absolute right-4 top-4 h-6 w-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {teams && <LeaderboardStats teams={teams} />}

      <div className="space-y-4 mt-6">
        {filteredTeams?.map((team) => (
          <TeamCard
            key={team._id}
            team={team}
            isAdmin={session?.user?.role === 'admin'}
            onUpdatePoints={updatePoints}
          />
        ))}
        
        {filteredTeams?.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">
              No teams found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}