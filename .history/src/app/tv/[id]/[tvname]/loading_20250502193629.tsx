export default function Loading() {
  return (
    <div className="min-h-screen flex sm:flex-row flex-col justify-center items-center bg-gray-900 text-white p-6">
      <div className="max-w-xs w-full sm:w-[250px] p-4 animate-pulse">
        <div className="h-96 bg-gray-700 rounded-lg mb-4 mx-auto"></div>
      </div>
      
      <div className="mx-4 w-full sm:w-2/3 space-y-4">
        <div className="h-8 bg-gray-700 rounded w-2/3 mx-auto"></div>

        <div className="h-4 bg-gray-600 rounded w-1/4 mx-auto"></div>
        <div className="h-4 bg-gray-600 rounded w-1/6 mx-auto"></div>

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
