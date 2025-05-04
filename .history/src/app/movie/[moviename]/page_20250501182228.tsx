import { Metadata } from "next";
import VideoPlayer from "@/components/VideoPlayer";

type Props = {
  params: { moviename: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const title = decodeURIComponent(params.moviename);

  return {
    title: `${title}`,
    description: `Information about the movie "${title}".`,
  };
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
}

async function getMovieDetails(title: string) {
  const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${title}`
  );
  const data = await response.json();
  return data.results[0] as Movie;
}

export default async function MoviePage({
  params,
}: {
  params: { moviename: string };
}) {
  const movieTitle = params.moviename.replace(/-/g, " ");
  const movie = await getMovieDetails(movieTitle);

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <VideoPlayer movieId={movie.id} />
      <div className="mt-8">
        <h1 className="text-3xl font-bold">{movie.title}</h1>
        <p className="mt-4 text-gray-300">{movie.overview}</p>
      </div>
    </div>
  );
}
