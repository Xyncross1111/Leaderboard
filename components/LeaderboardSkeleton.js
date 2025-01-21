export default function LeaderboardSkeleton({ children }) {
    // Ensure children is a valid value
    const renderedChildren = typeof children === 'string' ? children : '';
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse h-24 rounded-lg" />
          ))}
        </div>
        
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }