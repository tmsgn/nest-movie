export default function Loading() {
    return (
        <div className="w-screen h-screen overflow-x-hidden">
            <div className="w-full h-3/4 flex">
                {/* Video iframe placeholder */}
                <div className="w-2/3 h-full bg-gray-800 rounded-lg shadow-md animate-pulse"></div>

                {/* Details section placeholder */}
                <div className="flex flex-col w-1/3 min-h-full mr-7 ml-2">
                    <div className="flex">
                        {/* Poster placeholder */}
                        <div className="w-[200px] h-[300px] bg-gray-800 rounded-lg animate-pulse"></div>
                        <div className="ml-4 flex flex-col justify-start">
                            {/* Title placeholder */}
                            <div className="h-8 bg-gray-600 rounded w-3/4 animate-pulse"></div>

                            {/* Season/Episode placeholder */}
                            <div className="mt-2 h-6 bg-yellow-400 w-1/4 rounded-sm animate-pulse"></div>

                            {/* Details placeholders */}
                            <div className="mt-3 space-y-2">
                                <div className="h-5 bg-gray-600 rounded w-1/2 animate-pulse"></div>
                                <div className="h-5 bg-gray-600 rounded w-1/3 animate-pulse"></div>
                                <div className="h-5 bg-gray-600 rounded w-1/4 animate-pulse"></div>
                                <div className="h-5 bg-gray-600 rounded w-1/2 animate-pulse"></div>
                            </div>

                            {/* Genres placeholder */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="h-6 bg-yellow-400 rounded px-4 py-2 animate-pulse"
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Description placeholder */}
                    <div>
                        <div className="mt-4 h-6 bg-yellow-400 w-1/4 rounded animate-pulse"></div>
                        <div className="mt-3 space-y-2">
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
        </div>
    );
}
