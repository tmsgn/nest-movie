import { getTrendingMovies } from "@/lib/fetchMovies";
import MovieCard from "@/components/MovieCard";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: string[];
}

export default async function HomePage() {
  const movies = await getTrendingMovies();

  if (!movies) {
    return <div>Failed to load movies.</div>;
  }

  return (
    <main className="md:p-4 top-20 p-1 bg-gray-900 text-white">
      <div className="grid lg:grid-cols-8 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-3">
        {movies.map((movie: Movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </main>
  );
}
