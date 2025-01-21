'use client';

import { useSession } from 'next-auth/react';
import AdminLoginButton from './AdminLoginButton';
import Link from 'next/link';

export default function Navigation() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold text-gray-800">
          Team Leaderboard
        </Link>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link
              href="/create-team"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Create Team
            </Link>
          )}
          <AdminLoginButton />
        </div>
      </div>
    </nav>
  );
}