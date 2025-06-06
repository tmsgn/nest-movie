import { getTrendingMovies, getTrendingTVShows } from "@/lib/fetchMovies";
import MovieCard from "@/components/MovieCard";
import MovieSlider from "@/components/MovieSlider";



export default async function HomePage() {
  const movies = await getTrendingMovies();
  const tvShows = await getTrendingTVShows();

  const movieArray = Array.isArray(movies) ? movies : [];
  const tvShowArray = Array.isArray(tvShows) ? tvShows : [];

  if (movieArray.length === 0 && tvShowArray.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        looks like you are offline
      </div>
    );
  }

  return (
    <main className="md:p-4 p-1 bg-gray-900 text-white">
      {movieArray.length > 0 && (
        <>
          <MovieSlider
            movies={[
              ...movieArray
                .filter((movie) => movie.backdrop_path !== null)
                .map((movie) => ({
                  id: movie.id,
                  title: movie.title,
                  vote_average: movie.vote_average,
                  name: movie.name,
                  backdrop_path: movie.backdrop_path,
                  release_date: movie.release_date,
                  first_air_date: movie.first_air_date,
                  genre_names: movie.genres
                    ? Array.isArray(movie.genres)
                      ? movie.genres.map(
                          (g: string | { id: number; name: string }) =>
                            typeof g === "string" ? g : g.name
                        )
                      : []
                    : [],
                  media_type: "movie",
                })),
              ...tvShowArray
                .filter((tvshow) => tvshow.backdrop_path !== null)
                .map((tvshow) => ({
                  id: tvshow.id,
                  title: tvshow.title,
                  name: tvshow.name,
                  vote_average: tvshow.vote_average,
                  backdrop_path: tvshow.backdrop_path,
                  release_date: tvshow.release_date,
                  first_air_date: tvshow.first_air_date,
                  genre_names: tvshow.genres
                    ? Array.isArray(tvshow.genres)
                      ? tvshow.genres.map(
                          (g: string | { id: number; name: string }) =>
                            typeof g === "string" ? g : g.name
                        )
                      : []
                    : [],
                  media_type: "tv",
                })),
            ]}
          />

          <h1 className="md:text-3xl font-bold text-yellow-400 m-3">
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
          <h1 className="md:text-3xl font-bold text-yellow-400 m-3 mt-8">
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
