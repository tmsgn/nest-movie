import Image from "next/image";
import Link from "next/link";

// Interface for Movie data received in a list (from trending/search endpoints)
// This might be slightly different from the detail interface (e.g., genre_ids vs genres objects)
interface Movie {
  id: number;
  title?: string; // Title for movies
  name?: string; // Name for TV shows
  poster_path: string | null;
  release_date?: string; // Release date for movies
  first_air_date?: string; // First air date for TV shows
  vote_average: number;
  genre_ids?: number[]; // Common in list results - array of genre IDs (numbers)
  // If your fetchMovies provides genre names directly in list results,
  // you might need: genres?: string[];
  media_type: "movie" | "tv" | string; // Crucial to know if it's a movie or tv
}

export default function MovieCard({ movie }: { movie: Movie }) {

  // Use 'title' for movies, 'name' for TV shows, or a fallback
  const itemTitle = movie.title || movie.name || 'Untitled';
  // Use release_date for movies, first_air_date for TV shows
  const releaseDate = movie.release_date || movie.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;


  // Generate a slug from the title/name
  // Clean up extra characters often found in titles for URL safety
  const slug = encodeURIComponent(
    itemTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, '')
  );

  // Generate href based on media_type to match App Router structure
  // For 'tv', the route is /tv/[id]/[tvname]
  // For 'movie', the route is /movie/[movieid]/[movename]
  const href = movie.media_type === "tv" ?
               `/tv/${movie.id}/${slug}` :
               `/movie/${movie.id}/${slug}`; // Link to /movie/[movieid]/[movename]


  // Get the first genre name/ID to display
  // This part depends heavily on what your fetchMovies functions provide
  let firstGenreDisplay = null;
  if (movie.genre_ids && movie.genre_ids.length > 0) {
      // If you have genre IDs, you might want to display the ID or map it to a name
      firstGenreDisplay = `Genre ID: ${movie.genre_ids[0]}`; // Displaying ID for now
      // To display names, you'd need a map of genre IDs to names, potentially fetched once globally
  }
   // If your fetchMovies somehow provides a 'genres' array of strings in the list item:
  // else if (movie.genres && Array.isArray(movie.genres) && movie.genres.length > 0 && typeof movie.genres[0] === 'string') {
  //     firstGenreDisplay = movie.genres[0];
  // }


  return (
    <Link href={href} className="group block h-full">
      <div className="cursor-pointer rounded-lg p-1 group transition-transform transform hover:scale-105 relative h-full flex flex-col">
        <div className="relative flex-shrink-0">
          <Image
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/fallback.jpg"
            }
            alt={`${itemTitle} Poster`} // Improved alt text
            width={500}
            height={750}
            className="object-cover group-hover:opacity-60 rounded-lg w-full h-auto" // w-full h-auto for responsive image
          />
        </div>
        <div className="mt-2 flex-grow flex flex-col justify-between">
          {releaseYear && (
              <h1 className="text-xs md:text-sm font-medium text-gray-400 ">
                {releaseYear}
              </h1>
          )}

          <div>
            <h1 className="font-bold line-clamp-1 text-xs md:text-base">
              {itemTitle}
            </h1>
            <div className="flex justify-between items-center flex-wrap gap-1">
              {firstGenreDisplay && (
                <h1 className="md:text-sm max-w-32 break-words text-xs font-medium line-clamp-1 flex-shrink overflow-hidden">
                  {firstGenreDisplay}
                </h1>
              )}
              {movie.vote_average > 0 && (
                <h1 className="text-xs flex-shrink-0">{movie.vote_average.toFixed(1)}⭐</h1>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}