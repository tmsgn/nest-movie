import Image from "next/image";
import Link from "next/link";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genres: string[];
  media_type: string;
};

export default function MovieCard({ movie }: { movie: Movie }) {
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";
  
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/no-poster.png";
  
  const genre = movie.genres[0] || "Unknown";
  const voteAverage = movie.vote_average !== 0 ? movie.vote_average.toFixed(1) : "N/A";

  return (
    <Link
      href={`/${movie.media_type}/${movie.title.replace(/\s+/g, "-").toLowerCase()}`}
      className="relative group"
    >
      <div className="relative">
        <div className="cursor-pointer rounded-lg p-1 group transition-transform transform hover:scale-105 relative">
          <div className="relative">
            <Image
              src={posterUrl}
              alt={movie.title}
              width={500}
              height={750}
              className="object-cover group-hover:opacity-60 rounded-lg"
            />
          </div>
          <div className="mt-2 relative">
            <h1 className="text-xs md:text-sm font-medium text-gray-400">
              {releaseYear}
            </h1>
            <div>
              <h1 className="font-bold line-clamp-1 text-xs md:text-base">{movie.title}</h1>
              <div className="flex justify-between flex-wrap">
                <h1 className="md:text-sm max-w-32 break-words text-xs font-medium line-clamp-1">
                  {genre}
                </h1>
                {voteAverage !== "N/A" && (
                  <h1 className="text-xs">{voteAverage}⭐</h1>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
