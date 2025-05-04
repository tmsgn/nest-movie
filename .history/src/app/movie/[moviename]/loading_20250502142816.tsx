// src/app/movie/[moviename]/loading.tsx

export default function Loading() {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
        <div className="max-w-4xl w-full p-4 animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-4 w-2/3 mx-auto"></div>
  
          <div className="text-center mb-6 space-y-2">
            <div className="h-4 bg-gray-600 rounded w-1/4 mx-auto"></div>
            <div className="h-4 bg-gray-600 rounded w-1/6 mx-auto"></div>
          </div>
  
          <div className="relative pb-[56.25%] h-0 overflow-hidden mb-8">
            <div className="absolute top-0 left-0 w-full h-full bg-gray-700 rounded-lg"></div>
          </div>
  
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg space-y-2">
            <div className="h-5 bg-gray-600 rounded w-1/4"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }
  