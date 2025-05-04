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
      <div className="cursor-pointer hover:bg-yellow-400 rounded-lg p-1 group transition-transform transform hover:scale-105 relative">
        <div className="">
          <div className="absolute inset-0 flex items-center justify-center  bg-opacity-50  opacity-0 hover:opacity-100 ">
            <svg
              className="w-16 h-16 text-white cursor-pointer"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            width={500}
            height={750}
            className="object-cover rounded-lg group-"
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
