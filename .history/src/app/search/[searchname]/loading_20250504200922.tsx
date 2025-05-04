export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6 animate-pulse">
          Loading search results...
        </h1>
        <div className="grid lg:grid-cols-8 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-gray-700" />
              <div className="p-2 space-y-2">
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
