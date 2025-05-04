"use client";

export default function Loading() {
    return (
        <div className="w-screen h-screen overflow-x-hidden">
            <div className="w-full h-full flex flex-col">
                {/* Placeholder for the video iframe */}
                <div className="w-full h-2/5 bg-gray-800 animate-pulse"></div>

                {/* Placeholder for the details section */}
                <div className="flex flex-col md:flex-row w-full h-3/5 p-4 gap-4">
                    {/* Placeholder for the poster image */}
                    <div className="w-full md:w-1/4 h-[300px] bg-gray-800 rounded-lg animate-pulse"></div>

                    {/* Placeholder for the text details */}
                    <div className="flex flex-col w-full md:w-3/4 space-y-4">
                        <div className="h-6 bg-gray-800 w-3/4 rounded animate-pulse"></div>
                        <div className="h-5 bg-yellow-400 w-1/4 rounded animate-pulse"></div>

                        <div className="space-y-2">
                            <div className="h-4 bg-gray-800 w-1/2 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-800 w-1/3 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-800 w-1/4 rounded animate-pulse"></div>
                            <div className="h-4 bg-gray-800 w-1/2 rounded animate-pulse"></div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="text-sm font-medium bg-yellow-400 px-4 py-2 rounded animate-pulse"
                                ></div>
                            ))}
                        </div>

                        {/* Placeholder for the description */}
                        <div className="space-y-2">
                            <div className="h-5 bg-yellow-400 w-1/4 rounded animate-pulse"></div>
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
