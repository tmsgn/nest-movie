import Image from "next/image";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[] | string[];
  media_type: "movie" | "tv" | string;
}

export default function MovieCard({ movie }: { movie: Movie }) {

  const itemTitle = movie.title || movie.name;
  const releaseYear = movie.release_date || movie.first_air_date ?
                      new Date(movie.release_date || movie.first_air_date!).getFullYear()
                      : null;

  const slug = itemTitle ? encodeURIComponent(
    itemTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, '') // Added extra replace for safety
  ) : 'detail';

  // Update the href to match the app's routing structure
  const href = movie.media_type === "tv" ?
               `/tv/${slug}` :
               `/movie/${slug}`;

    const firstGenreName = (movie.genres && movie.genres.length > 0) ?
                         (typeof movie.genres[0] === 'string' ? movie.genres[0] : (movie.genres[0] as { name: string }).name)
                         : (movie.genre_ids && movie.genre_ids.length > 0)
                         ? `Genre ID: ${movie.genre_ids[0]}`
                         : null;

  return (
    <Link
      href={href}  // Use the href variable we defined above instead of constructing a new one
      className="group"
    >
      <div className="cursor-pointer rounded-lg p-1 group transition-transform transform hover:scale-105 relative h-full flex flex-col">
        <div className="relative flex-shrink-0">
          <Image
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "/fallback.jpg"
            }
            alt={itemTitle || "Movie/TV Show Poster"}
            width={500}
            height={750}
            className="object-cover group-hover:opacity-60 rounded-lg w-full h-auto"
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
              {firstGenreName && (
                <h1 className="md:text-sm max-w-32 break-words text-xs font-medium line-clamp-1 flex-shrink overflow-hidden">
                  {firstGenreName}
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