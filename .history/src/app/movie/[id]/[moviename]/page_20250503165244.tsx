import { Metadata } from "next";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
};

async function getMovieDetails(id: string) {
  const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
  );
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data as Movie;
}

export function generateMetadata({
  params,
}: {
  params: { id: string; moviename: string };
}): Metadata {
  const title = decodeURIComponent(params.moviename).replace(/-/g, " ");
  return {
    title: `${title.charAt(0).toUpperCase()}${title.slice(1)}`,
    description: `Watch ${title.charAt(0).toUpperCase()}${title.slice(1)} on MovieNest`,
  };
}

export default async function MoviePage({
  params,
}: {
  params: { id: string; moviename: string };
}) {
  const movie = await getMovieDetails(params.id);

  if (!movie) {
    return <div>Movie not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <div className="max-w-4xl w-full p-4">
        <h1 className="text-4xl font-bold text-center mb-4">{movie.title}</h1>

        <div className="text-center mb-6">
          <p className="text-lg">
            {new Date(movie.release_date).getFullYear()}
          </p>
          <p className="text-sm font-medium text-gray-400">
            {movie.vote_average} / 10
          </p>
        </div>

        <div className="relative pb-[56.25%] h-0 overflow-hidden mb-8">
          <iframe
            src={`https://vidfast.pro/movie/${movie.id}`}
            className="w-full h-[500px] rounded-lg shadow-md"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
          ></iframe>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-sm text-gray-300">{movie.overview}</p>
        </div>
      </div>
    </div>
  );
}
