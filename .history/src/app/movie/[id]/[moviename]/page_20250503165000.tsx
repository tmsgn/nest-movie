import { getTrendingMovies, getTrendingTVShows } from "@/lib/fetchMovies";
import MovieCard from "@/components/MovieCard";

// Interface for Movie data received from your fetchMovies functions (list data)
interface Movie {
  id: number;
  title?: string; // Title for movies
  name?: string; // Name for TV shows
  poster_path: string | null;
  release_date?: string; // Release date for movies
  first_air_date?: string; // First air date for TV shows
  vote_average: number;
  genre_ids?: number[]; // Common in list results - array of genre IDs (numbers)
  genres?: string[]; // <--- ADDED THIS BACK: If your fetchMovies returns genre names as strings
  overview?: string; // Overview might be summary in list results, could be optional here
  media_type: "movie" | "tv" | string; // Crucial to know if it's a movie or tv
}

// Assume getTrendingMovies and getTrendingTVShows are defined in lib/fetchMovies.ts
// and return Promise<Movie[]> where Movie matches the interface above.

export default async function HomePage() {
  const movies = await getTrendingMovies();
  const tvShows = await getTrendingTVShows();

  const movieArray = Array.isArray(movies) ? movies : [];
  const tvShowArray = Array.isArray(tvShows) ? tvShows : [];

  if (movieArray.length === 0 && tvShowArray.length === 0) {
    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
            No trending content available.
        </div>
    );
  }

  return (
    <main className="md:p-4 p-1 bg-gray-900 text-white">
      {movieArray.length > 0 && (
        <>
          <h1 className="text-3xl font-bold text-yellow-400 m-3">Trending Movies</h1>
          <div className="grid lg:grid-cols-8 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-3">
            {movieArray.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}

      {tvShowArray.length > 0 && (
        <>
          <h1 className="text-3xl font-bold text-yellow-400 m-3 mt-8">Trending TV Shows</h1>
          <div className="grid lg:grid-cols-8 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-3">
            {tvShowArray.map((tvshow) => (
              <MovieCard key={tvshow.id} movie={tvshow} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}