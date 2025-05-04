export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-6">
      <div className="max-w-4xl w-full space-y-8">
        {/* Title Placeholder */}
        <div className="h-8 bg-gray-700 rounded w-2/3 mx-auto"></div>

        {/* Genres Placeholder */}
        <div className="h-4 bg-gray-600 rounded w-1/4 mx-auto"></div>

        {/* Video Placeholder */}
        <div className="relative pb-[56.25%] h-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gray-700 rounded-lg"></div>
        </div>

        {/* Cast Placeholder */}
        <div className="space-y-4">
          <div className="h-5 bg-gray-600 rounded w-1/4 mx-auto"></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-24 w-24 bg-gray-700 rounded-full mx-auto"
              ></div>
            ))}
          </div>
        </div>

        {/* Episodes Placeholder */}
        <div className="space-y-4">
          <div className="h-5 bg-gray-600 rounded w-1/4 mx-auto"></div>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-16 bg-gray-700 rounded-lg w-full"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
