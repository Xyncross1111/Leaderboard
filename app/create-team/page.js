'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CreateTeam() {
  const { data: session } = useSession();
  const router = useRouter();
  const [teamName, setTeamName] = useState('');
  const [members, setMembers] = useState(['']);
  const [error, setError] = useState('');

  // Redirect if not admin
  if (!session?.user?.role === 'admin') {
    router.push('/');
    return null;
  }

  const handleAddMember = () => {
    if (members.length < 3) {
      setMembers([...members, '']);
    }
  };

  const handleRemoveMember = (index) => {
    const newMembers = members.filter((_, i) => i !== index);
    setMembers(newMembers);
  };

  const handleMemberChange = (index, value) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: teamName,
          members: members.filter(member => member.trim() !== '')
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create team');
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Team</h1>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Team Name
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Team Members (1-3 members)
          </label>
          {members.map((member, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={member}
                onChange={(e) => handleMemberChange(index, e.target.value)}
                placeholder={`Member ${index + 1}`}
                required
                className="flex-1 p-2 border rounded-md"
              />
              {members.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveMember(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          {members.length < 3 && (
            <button
              type="button"
              onClick={handleAddMember}
              className="text-blue-500 hover:text-blue-700"
            >
              Add Member
            </button>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Create Team
        </button>
      </form>
    </div>
  );
} 