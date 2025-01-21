import TeamLeaderboard from '../components/TeamLeaderboard';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Team Leaderboard
        </h1>
        <p className="text-gray-600">
          Track team performance and rankings
        </p>
      </div>
      
      <div className="mt-8">
        <TeamLeaderboard />
      </div>
    </div>
  );
}