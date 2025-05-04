export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-[500px] bg-gray-800 rounded-lg mb-4"></div>
      <div className="space-y-4">
        <div className="h-8 bg-gray-600 rounded w-3/4"></div>
        <div className="h-4 bg-gray-600 rounded w-1/4"></div>
        <div className="h-4 bg-gray-600 rounded w-1/2"></div>
        <div className="h-4 bg-gray-600 rounded w-2/3"></div>
      </div>
    </div>
  );
}
