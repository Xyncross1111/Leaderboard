import { Inter } from 'next/font/google';
import './globals.css';
import { NextAuthProvider } from './providers';
import Navigation from '../components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Team Leaderboard',
  description: 'Track team performance and rankings',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <Navigation />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </NextAuthProvider>
      </body>
    </html>
  );
}