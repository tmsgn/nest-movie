import Image from "next/image";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: string[];
};

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="relative">
      <div className="cursor-pointer rounded-lg p-1 group transition-transform transform hover:scale-105 relative">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined scale-300 text-white  cursor-pointer">
              play_circle
            </span>
          </div>

          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            width={500}
            height={750}
            className="object-cover rounded-lg"
          />
        </div>
        <div className="mt-2">
          <h1 className="text-xs md:text-sm font-medium text-gray-700 ">
            {new Date(movie.release_date).getFullYear()}
          </h1>

          <div>
            <h1 className="font-bold line-clamp-1">{movie.title}</h1>

            <h1 className="md:text-sm text-xs font-medium line-clamp-1">
              {movie.genres[1]}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
