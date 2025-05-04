"use client";

export default function Loading() {
  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <div className="w-full h-3/4 flex">
        {/* Placeholder for the video iframe */}
        <div className="w-2/3 h-full rounded-lg shadow-md bg-gray-800 animate-pulse"></div>

        {/* Placeholder for the details section */}
        <div className="flex flex-col w-1/3 min-h-full mr-7 ml-2">
          <div className="flex">
            {/* Placeholder for the poster image */}
            <div className="rounded-lg h-fit bg-gray-800 w-[200px] h-[300px] animate-pulse"></div>

            {/* Placeholder for the text details */}
            <div className="ml-4 flex flex-col justify-start">
              <div className="h-6 bg-gray-800 w-3/4 rounded animate-pulse"></div>
              <div className="mt-2 h-5 bg-yellow-400 w-1/4 rounded animate-pulse"></div>

              <div className="mt-3 space-y-2">
                <div className="h-4 bg-gray-800 w-1/2 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-800 w-1/3 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-800 w-1/4 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-800 w-1/2 rounded animate-pulse"></div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="text-sm font-medium bg-yellow-400 px-4 py-2 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Placeholder for the description */}
          <div>
            <div className="mt-4 h-5 bg-yellow-400 w-1/4 rounded animate-pulse"></div>
            <div className="mt-3 space-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-4 bg-gray-800 w-full rounded animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}