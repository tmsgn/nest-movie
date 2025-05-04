import { getTrendingMovies, getTrendingTVShows } from "@/lib/fetchMovies";
import MovieCard from "@/components/MovieCard";

interface Movie {
  id: number;
  title: string;
  name?: string; // TV shows use 'name'
  poster_path: string | null;
  release_date?: string; // Movies use 'release_date'
  first_air_date?: string; // TV shows use 'first_air_date'
  vote_average: number;
  genre_ids?: number[]; // Trending lists often return genre_ids
  genres?: { id: number; name: string }[] | string[]; // Detail endpoints return full genre objects
  overview: string;
  media_type: "movie" | "tv" | string; // Crucial for distinguishing movies/tv in cards and links
}


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