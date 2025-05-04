export default function Loading() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
      {/* Main Info */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 flex justify-center md:justify-start">
          <div className="w-[300px] h-[450px] bg-gray-700 rounded-lg animate-pulse"></div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="h-8 bg-gray-700 rounded w-2/3 animate-pulse"></div>
          <div className="flex gap-4">
            <div className="h-4 bg-gray-600 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-600 rounded w-12 animate-pulse"></div>
            <div className="h-4 bg-yellow-500 rounded w-8 animate-pulse"></div>
          </div>
          <div className="h-16 bg-gray-700 rounded animate-pulse"></div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-6 bg-yellow-400 rounded w-20 animate-pulse"
              ></div>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/3 mt-6 md:mt-0">
          <div className="h-6 bg-gray-700 rounded w-1/2 mb-4 animate-pulse"></div>
          <div className="aspect-w-16 aspect-h-9 bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Cast */}
      <div className="mt-12">
        <div className="h-6 bg-yellow-400 rounded w-32 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="w-20 h-28 bg-gray-700 rounded-lg animate-pulse"></div>
              <div className="h-4 bg-gray-600 rounded w-16 mt-2 animate-pulse"></div>
              <div className="h-3 bg-gray-600 rounded w-12 mt-1 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Episodes */}
      <div className="mt-12">
        <div className="h-6 bg-gray-700 rounded w-32 mb-4 animate-pulse"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-lg overflow-hidden shadow w-32 sm:w-36 md:w-40 lg:w-44 xl:w-48 animate-pulse"
            >
              <div className="w-full h-20 sm:h-24 md:h-28 bg-gray-700"></div>
              <div className="p-2 space-y-2">
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <div className="px-4 py-2 rounded bg-gray-600 w-16 h-8 animate-pulse"></div>
          <div className="px-4 py-2 rounded bg-gray-600 w-16 h-8 animate-pulse"></div>
        </div>

        <div className="text-center mt-2 text-sm text-gray-400">
          <div className="h-4 bg-gray-600 rounded w-24 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
