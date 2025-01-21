'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function NewTeam() {
  const { data: session } = useSession();
  const router = useRouter();
  const [name, setName] = useState('');
  const [members, setMembers] = useState(['']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!session?.user?.role === 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          Access denied. Please login as an admin.
        </div>
      </div>
    );
  }

  const addMember = () => {
    if (members.length < 3) {
      setMembers([...members, '']);
    }
  };

  const removeMember = (index) => {
    if (members.length > 1) {
      const newMembers = [...members];
      newMembers.splice(index, 1);
      setMembers(newMembers);
    }
  };

  const updateMember = (index, value) => {
    const newMembers = [...members];
    newMembers[index] = value;
    setMembers(newMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          members: members.filter(m => m.trim())
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error creating team');
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Team</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Team Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter team name"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Team Members
            </label>
            {members.map((member, index) => (
              <div key={index} className="flex mb-3">
                <input
                  type="text"
                  value={member}
                  onChange={(e) => updateMember(index, e.target.value)}
                  required
                  className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={`Member ${index + 1}`}
                />
                {members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    className="ml-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            
            {members.length < 3 && (
              <button
                type="button"
                onClick={addMember}
                className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Add Member ({3 - members.length} remaining)
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg text-white font-semibold
              ${isSubmitting ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {isSubmitting ? 'Creating Team...' : 'Create Team'}
          </button>
        </form>
      </div>
    </div>
  );
}