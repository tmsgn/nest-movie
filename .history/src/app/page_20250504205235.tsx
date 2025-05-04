import { getTrendingMovies, getTrendingTVShows } from "@/lib/fetchMovies";
import MovieCard from "@/components/MovieCard";
impo
import { motion } from "framer-motion";

interface Movie {
  id: number;
  title: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[] | string[];
  overview: string;
  media_type: "movie" | "tv" | string;
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
    <main className="md:p-4 p-1 bg-gray-900 text-white space-y-8">
      {movieArray.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h1 className="text-3xl font-bold text-yellow-400 m-3">Trending Movies</h1>
          <div className="grid lg:grid-cols-8 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-3">
            {movieArray.map((movie) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * (movieArray.indexOf(movie) % 5), duration: 0.5 }}
                viewport={{ once: true }}
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {tvShowArray.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h1 className="text-3xl font-bold text-yellow-400 m-3 mt-8">Trending TV Shows</h1>
          <div className="grid lg:grid-cols-8 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-3">
            {tvShowArray.map((tvshow) => (
              <motion.div
                key={tvshow.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * (tvShowArray.indexOf(tvshow) % 5), duration: 0.5 }}
                viewport={{ once: true }}
              >
                <MovieCard movie={tvshow} />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </main>
  );
}
