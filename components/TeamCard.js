'use client';

import { useState } from 'react';

export default function TeamCard({ team, isAdmin, onUpdatePoints }) {
  const [isEditing, setIsEditing] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState(0);
  const [showMembers, setShowMembers] = useState(false);

  const handleUpdatePoints = async () => {
    const newPoints = team.points + Number(pointsToAdd);
    if (newPoints < 0) {
      alert('Points cannot be negative');
      return;
    }
    await onUpdatePoints(team._id, newPoints);
    setIsEditing(false);
    setPointsToAdd(0);
  };

  const handleQuickUpdate = async (amount) => {
    const newPoints = team.points + amount;
    if (newPoints < 0) {
      alert('Points cannot be negative');
      return;
    }
    await onUpdatePoints(team._id, newPoints);
  };

  const getRankColor = (points) => {
    if (points >= 1000) return 'bg-yellow-500';
    if (points >= 750) return 'bg-gray-400';
    if (points >= 500) return 'bg-orange-600';
    return 'bg-green-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div 
          className="flex-1 cursor-pointer" 
          onClick={() => setShowMembers(!showMembers)}
        >
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-gray-800">{team.name}</h2>
            <span className={`${getRankColor(team.points)} text-white text-sm px-2 py-1 rounded`}>
              {team.points} pts
            </span>
            <svg
              className={`w-5 h-5 text-gray-500 transform transition-transform ${
                showMembers ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          
          {showMembers && (
            <div className="mt-4 text-gray-600 pl-2 border-l-2 border-gray-200">
              <h3 className="font-semibold text-gray-700">Team Members:</h3>
              <ul className="mt-2 space-y-1">
                {team.members.map((member, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span>{member.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="text-right ml-4">
            {isEditing ? (
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={pointsToAdd}
                    onChange={(e) => setPointsToAdd(parseInt(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Points"
                  />
                  <button
                    onClick={handleUpdatePoints}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                  >
                    Update
                  </button>
                </div>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setPointsToAdd(0);
                  }}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuickUpdate(-10)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => handleQuickUpdate(10)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                  >
                    +10
                  </button>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-blue-500 hover:text-blue-700 text-sm transition-colors"
                >
                  Custom Points
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}