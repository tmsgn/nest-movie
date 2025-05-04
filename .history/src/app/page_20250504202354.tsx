import { getTrendingMovies, getTrendingTVShows } from "@/lib/fetchMovies";
import MovieCard from "@/components/MovieCard";
import MovieSlider from "@/components/MovieSlider"; // ✅ Import slider

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
      {/* ✅ JUST ADD THIS LINE */}
      <MovieSlider
        movies={movieArray.slice(0, 10).map((movie) => ({
          id: movie.id,
          title: movie.title,
          name: movie.name,
          backdrop_path: movie.backdrop_path || null,
          release_date: movie.release_date,
          first_air_date: movie.first_air_date,
        }))}
      />

      {/* ✅ REST OF YOUR ORIGINAL CODE UNCHANGED */}
      {movieArray.length > 0 && (
        <>
          <h1 className="text-3xl font-bold text-yellow-400 m-3">
            Trending Movies
          </h1>
          <div className="grid lg:grid-cols-8 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-3">
            {movieArray.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}

      {tvShowArray.length > 0 && (
        <>
          <h1 className="text-3xl font-bold text-yellow-400 m-3 mt-8">
            Trending TV Shows
          </h1>
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
