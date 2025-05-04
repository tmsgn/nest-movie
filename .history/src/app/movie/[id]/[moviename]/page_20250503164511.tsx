import { Metadata } from "next";
import MovieCard from "@/components/MovieCard";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genres: { id: number; name: string }[];
};

async function getMovieDetails(title: string) {
  const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${title}`
  );
  const data = await response.json();
  const movie = data.results[0];

  if (!movie) {
    throw new Error("Movie not found");
  }

  // Fetch genres for the movie
  const genreResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${API_KEY}`
  );
  const genreData = await genreResponse.json();

  return {
    ...movie,
    genres: genreData.genres.map((genre: { id: number; name: string }) => genre.name),
  } as Movie;
}

export function generateMetadata({
  params,
}: {
  params: { moviename: string };
}): Metadata {
  const title = decodeURIComponent(params.moviename);
  return {
    title: `${title.charAt(0).toUpperCase()}${title.slice(1)}`,
    description: `Watch ${title.charAt(0).toUpperCase()}${title.slice(1)} on MovieNest`,
  };
}

export default async function MoviePage({
  params,
}: {
  params: { moviename: string };
}) {
  const title = decodeURIComponent(params.moviename);
  let movie: Movie;

  try {
    movie = await getMovieDetails(title);
  } catch (error) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl font-bold">Movie not found</h1>
        <p className="text-gray-500">Please check the movie name and try again.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MovieCard movie={movie} />
      <div className="mt-4">
        <h2 className="text-lg font-bold">Overview</h2>
        <p className="text-gray-700 mt-2">{movie.overview}</p>
      </div>
    </div>
  );
}