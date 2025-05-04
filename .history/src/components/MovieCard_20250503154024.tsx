import Image from "next/image";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genres: string[]; // FIX 1: Changed from string[][] to string[]
  media_type: "movie" | "tv"; // Added media_type type hint for clarity
}

export default function MovieCard({ movie }: { movie: Movie }) {
  // Generate a slug from the title for use in URLs
  const slug = encodeURIComponent(
    movie.title.toLowerCase().replace(/\s+/g, "-")
  );

  // FIX 3: Generate href based on media_type to match App Router structure
  // For 'tv', the route requires both ID and slug: /tv/[id]/[tvname]
  // For 'movie', the route is /movie/[moviename] - using the slug seems intended
  const href =
    movie.media_type === "tv" ?
    `/tv/${movie.id}/${slug}` :
    `/movie/${slug}`; // Assuming movie route uses title slug

  return (
    <Link href={href} className="group block h-full"> {/* Added block and h-full for better flex/grid item */}
      {/* FIX 5: Slightly simplified the nested divs. The outer div is often redundant. */}
      <div className="cursor-pointer rounded-lg p-1 group transition-transform transform hover:scale-105 relative h-full"> {/* h-full helps with grid/flex alignment */}
        <div className="relative"> {/* Keep relative if planning overlays */}
          <Image
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/fallback.jpg"
            }
            alt={movie.title}
            // FIX 4 (Optional): Consider adjusting size based on context
            width={500} // Example size - adjust as needed for your layout
            height={750} // Example size - maintain aspect ratio
            className="object-cover group-hover:opacity-60 rounded-lg w-full" // w-full added for flex/grid filling
          />
        </div>
        <div className="mt-2"> {/* Relative removed here */}
          {movie.release_date && ( // Added check in case release_date is missing
              <h1 className="text-xs md:text-sm font-medium text-gray-400 ">
                {new Date(movie.release_date).getFullYear()}
              </h1>
          )}


          <div> {/* Relative removed here */}
            <h1 className="font-bold line-clamp-1 text-xs md:text-base">
              {movie.title}
            </h1>
            <div className="flex justify-between flex-wrap">
              {/* FIX 2: Check if genres exist and show the first one */}
              {movie.genres && movie.genres.length > 0 && (
                <h1 className="md:text-sm max-w-32 break-words text-xs font-medium line-clamp-1">
                  {movie.genres[0]} {/* Changed from genres[1] to genres[0] */}
                </h1>
              )}
              {/* Kept original vote average logic */}
              {movie.vote_average !== 0 && (
                <h1 className="text-xs">{movie.vote_average.toFixed(1)}⭐</h1>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}