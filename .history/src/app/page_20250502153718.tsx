import { getTrendingMovies, getTrendingTVShows } from "@/lib/fetchMovies";
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
  const tvShows = await getTrendingTVShows();

  if (!movies) {
    return <div>Failed to load movies.</div>;
  }

  return (
    <main className="md:p-4 p-1 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 m-3">Trending Movies</h1>
      <div className="grid lg:grid-cols-8 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-3">
        {movies.map((movie: Movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <h1 className="text-3xl font-bold text-yellow-400 m-3">Trending TVshows</h1>
      <div className="grid lg:grid-cols-8 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-3">
        {movies.map((movie: Movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </main>
  );
}
