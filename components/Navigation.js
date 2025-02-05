'use client';

import { useSession } from 'next-auth/react';
import AdminLoginButton from './AdminLoginButton';
import Link from 'next/link';

export default function Navigation() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';

  return (
    <nav className="bg-card-bg border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          href="/" 
          className="text-2xl font-bold text-text-primary hover:text-accent-primary transition-colors"
        >
          Carnival Carousel
        </Link>
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link
              href="/create-team"
              className="bg-accent-primary hover:bg-accent-secondary text-white px-4 py-2 rounded-md text-sm font-medium transition-all hover:shadow-lg"
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