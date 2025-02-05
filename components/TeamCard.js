'use client';

import { useState } from 'react';

export default function TeamCard({ team, position, onUpdatePoints, onDeleteTeam, isAdmin }) {
  const [isEditing, setIsEditing] = useState(false);
  const [customPoints, setCustomPoints] = useState('');

  const handlePointsUpdate = (amount) => {
    const newPoints = team.points + amount;
    if (newPoints >= 0) {
      onUpdatePoints(team._id, newPoints);
    }
  };

  const handleCustomPoints = (e) => {
    e.preventDefault();
    const points = parseInt(customPoints);
    if (!isNaN(points)) {
      onUpdatePoints(team._id, points);
      setCustomPoints('');
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 relative transform transition-all hover:scale-105">
      {/* Position Badge */}
      <div className="absolute -top-3 -left-3 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
        #{position}
      </div>

      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{team.name}</h3>
        {isAdmin && (
          <button
            onClick={() => onDeleteTeam(team._id)}
            className="text-red-500 hover:text-red-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-2">
        {team.members.map((member, index) => (
          <p key={index} className="text-gray-600">{member.name}</p>
        ))}
      </div>

      <div className="mt-4">
        <p className="text-2xl font-bold text-blue-600">{team.points} points</p>
      </div>

      {isAdmin && (
        <div className="mt-4 space-y-2">
          <div className="flex space-x-2">
            <button
              onClick={() => handlePointsUpdate(-100)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              -100
            </button>
            <button
              onClick={() => handlePointsUpdate(-200)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              -200
            </button>
            <button
              onClick={() => handlePointsUpdate(250)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              +250
            </button>
            <button
              onClick={() => handlePointsUpdate(500)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              +500
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Custom
            </button>
          </div>

          {isEditing && (
            <form onSubmit={handleCustomPoints} className="flex space-x-2">
              <input
                type="number"
                value={customPoints}
                onChange={(e) => setCustomPoints(e.target.value)}
                placeholder="Enter points"
                className="flex-1 px-2 py-1 border rounded"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Set
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}