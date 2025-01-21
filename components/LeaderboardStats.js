export default function LeaderboardStats({ teams }) {
    // Ensure teams is an array
    const totalTeams = Array.isArray(teams) ? teams.length : 0;
    const averagePoints = totalTeams > 0 
        ? Math.round(teams.reduce((sum, team) => sum + team.points, 0) / totalTeams)
        : 0; // Default to 0 if no teams

    const topTeam = totalTeams > 0 ? teams[0] : null; // Handle case when no teams

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-500 text-white p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Total Teams</h3>
                <p className="text-2xl font-bold">{totalTeams}</p>
            </div>
            <div className="bg-green-500 text-white p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Average Points</h3>
                <p className="text-2xl font-bold">{averagePoints}</p>
            </div>
            <div className="bg-purple-500 text-white p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Top Team</h3>
                <p className="text-2xl font-bold">{topTeam?.name || 'N/A'}</p>
                <p className="text-sm">{topTeam?.points || 0} points</p>
            </div>
        </div>
    );
}
  