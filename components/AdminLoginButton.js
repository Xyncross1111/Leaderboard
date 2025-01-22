'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function AdminLoginButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <button
        onClick={() => signOut()}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all hover:shadow-lg"
      >
        Sign Out
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="bg-accent-primary hover:bg-accent-secondary text-white px-4 py-2 rounded-md text-sm font-medium transition-all hover:shadow-lg"
    >
      Admin Login
    </button>
  );
} 