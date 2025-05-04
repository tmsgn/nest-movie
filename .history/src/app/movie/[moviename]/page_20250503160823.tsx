import { Metadata } from "next";
import Image from "next/image";

interface MovieDetails {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genres: { id: number; name: string }[];
  runtime?: number;
}

async function getMovieDetails(id: number): Promise<MovieDetails | null> {
  const API_KEY = process.env.TMDB_API_KEY;
  if (!API_KEY) {
    console.error("TMDB_API_KEY is not set");
    return null;
  }
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
  );

  if (!response.ok) {
    console.error("Failed to fetch movie details:", response.statusText);
    return null;
  }

  const data = await response.json();
  return data as MovieDetails;
}

export async function generateMetadata({
  params,
}: {
  params: { movieid: string; moviename: string };
}): Promise<Metadata> {
  const movieId = Number(params.movieid);
  if (isNaN(movieId)) {
    return { title: "Invalid Movie ID" };
  }
  const movie = await getMovieDetails(movieId);

  if (!movie) {
    return {
      title: "Movie Not Found",
      description: "The requested movie could not be found.",
    };
  }

  return {
    title: movie.title,
    description: movie.overview
      ? movie.overview.substring(0, 150) + "..."
      : `Watch ${movie.title} on MovieNest`,
  };
}

export default async function MoviePage({
  params,
}: {
  params: { movieid: string; moviename: string };
}) {
  const movieId = Number(params.movieid);

  if (isNaN(movieId)) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        Invalid Movie ID.
      </div>
    );
  }

  const movie = await getMovieDetails(movieId);

  if (!movie) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        Movie not found.
      </div>
    );
  }

  const genreNames = movie.genres?.map((g) => g.name).join(", ") || "N/A";

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-4">
      <div className="max-w-4xl w-full flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 md:w-1/3 flex justify-center">
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={300}
              height={450}
              className="rounded-lg shadow-lg object-cover"
            />
          ) : (
            <div className="w-[300px] h-[450px] bg-gray-700 rounded-lg flex items-center justify-center text-center">
              No Poster Available
            </div>
          )}
        </div>

        <div className="flex-grow md:w-2/3">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>

          <div className="text-gray-400 text-sm mb-4">
            {movie.release_date && (
              <span>{new Date(movie.release_date).getFullYear()}</span>
            )}
            {movie.release_date && movie.vote_average > 0 && <span> • </span>}
            {movie.vote_average > 0 && (
              <span>{movie.vote_average.toFixed(1)} / 10 ⭐</span>
            )}
            {genreNames !== "N/A" && <span> • {genreNames}</span>}
          </div>

          <div
            className="relative w-full mb-8"
            style={{ paddingTop: "56.25%" }}
          >
            <iframe
              src={`https://vidfast.pro/movie/${movie.id}`}
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation"
              title={`Video player for ${movie.title}`}
            ></iframe>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              {movie.overview || "No overview available."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}