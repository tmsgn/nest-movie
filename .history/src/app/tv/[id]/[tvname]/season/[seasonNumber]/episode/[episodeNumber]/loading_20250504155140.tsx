export default function Loading() {
    return (
      <div className="min-h-screen p-4">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6 animate-pulse">
          Loading Episode Details...
        </h1>
        <div className="space-y-6">
          {/* Placeholder for the video and details */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Video iframe placeholder */}
            <div className="w-full md:w-2/3 bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-64 bg-gray-700" />
            </div>
  
            {/* Details section placeholder */}
            <div className="flex-1 space-y-4">
              {/* Poster placeholder */}
              <div className="w-[200px] h-[300px] bg-gray-800 rounded-lg animate-pulse"></div>
  
              {/* Text placeholders */}
              <div className="space-y-2">
                <div className="h-6 bg-gray-600 rounded w-3/4"></div>
                <div className="h-5 bg-yellow-400 rounded w-1/4"></div>
                <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                <div className="h-4 bg-gray-600 rounded w-1/3"></div>
                <div className="h-4 bg-gray-600 rounded w-1/4"></div>
              </div>
  
              {/* Genres placeholder */}
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-6 bg-yellow-400 rounded px-4 py-2 animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
  
          {/* Placeholder for the description */}
          <div>
            <h2 className="text-lg font-bold text-gray-400 mb-4 animate-pulse">
              Description
            </h2>
            <div className="space-y-2">
              <div className="h-5 bg-yellow-400 rounded w-1/4"></div>
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-4 bg-gray-600 rounded w-full animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }