import Image from "next/image";
import Link from "next/link";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: string[];
  media_type: string;
};

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link
      href={`/${movie.media_type}/${movie.title.replace(/\s+/g, "-").toLowerCase()}`}
      className="relative group"
    >
      <div className="relative">
        <div className="cursor-pointer rounded-lg p-1 group transition-transform transform hover:scale-105 relative">
          <div className="relative">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={500}
              height={750}
              className="object-cover group-hover:opacity-60 rounded-lg"
            />
          </div>
          <div className="mt-2 relative">
            <h1 className="text-xs md:text-sm font-medium text-gray-400 ">
              {new Date(movie.release_date).getFullYear()}
            </h1>

            <div className="">
              <h1 className="font-bold line-clamp-1 text-xs md:text-base">{movie.title}</h1>
              <div className="flex justify-between flex-wrap">
                <h1 className="md:text-sm ml-3 text-xs font-medium line-clamp-1">
                  {movie.genres[1]}
                </h1>
                {movie.vote_average !== 0 && (
                  <h1 className="text-xs">{movie.vote_average.toFixed(1)}⭐</h1>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
