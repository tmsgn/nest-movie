export default function Loading() {
  return (
    <div className="md:p-4 p-1 bg-gray-900 text-white animate-pulse">
      <h1 className="text-3xl font-bold text-yellow-400 m-3">Trending Movies</h1>
      <div className="grid lg:grid-cols-8 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-[300px] bg-gray-800 rounded-lg"
          ></div>
        ))}
      </div>

      <h1 className="text-3xl font-bold text-yellow-400 m-3 mt-8">Trending TV Shows</h1>
      <div className="grid lg:grid-cols-8 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="h-[300px] bg-gray-800 rounded-lg"
          ></div>
        ))}
      </div>
    </div>
  );
}
