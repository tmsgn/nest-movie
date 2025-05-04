export default function Loading() {
  return (
    <div className="min-h-screen p-4">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6 animate-pulse">
        Loading TV show details...
      </h1>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-64 bg-gray-700" />
          </div>
          <div className="flex-1 space-y-4">
            <div className="h-6 bg-gray-600 rounded w-1/2"></div>
            <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            <div className="h-4 bg-gray-600 rounded w-full"></div>
            <div className="h-4 bg-gray-600 rounded w-5/6"></div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-400 mb-4 animate-pulse">
            Episodes
          </h2>
          <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse"
          >
                <div className="h-32 bg-gray-700" />
            <div className="p-2 space-y-2">
              <div className="h-4 bg-gray-600 rounded w-3/4"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        ))}
          </div>
        </div>
      </div>
    </div>
  );
}
