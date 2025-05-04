import { Metadata } from "next";
import Image from "next/image";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  // Note: The search endpoint might not reliably return all detail fields like full genres array or runtime
  // If you need more details, you would typically use the ID endpoint after getting the ID from search.
  // This code assumes the search result provides enough info based on your original interface.
}

async function getMovieDetailsByTitle(title: string): Promise<Movie | null> {
  const API_KEY = process.env.TMDB_API_KEY;
  if (!API_KEY) {
      console.error("TMDB_API_KEY is not set");
      return null;
  }
  // Using the search endpoint - this is less reliable than fetching by ID
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
  );

  if (!response.ok) {
      console.error("Failed to search for movie:", response.statusText);
      return null;
  }

  const data = await response.json();

  // The search returns a list. We assume the first result is the correct one.
  // This assumption is unreliable.
  const movie = data.results && data.results.length > 0 ? data.results[0] : null;

  if (!movie) {
      console.warn(`No search results found for title: ${title}`);
  }

  return movie as Movie;
}

export async function generateMetadata({
  params,
}: {
  params: { moviename: string };
}): Promise<Metadata> {
  const movieTitleFromSlug = decodeURIComponent(params.moviename).replace(/-/g, " ");

  // Note: Fetching here again to get the actual title from search results
  // This adds an extra API call and is still subject to search endpoint reliability
  const movie = await getMovieDetailsByTitle(movieTitleFromSlug);

  if (!movie) {
    return {
        title: "Movie Not Found",
        description: "The requested movie could not be found.",
    };
  }

  return {
    title: movie.title,
    description: movie.overview ? movie.overview.substring(0, 150) + "..." : `Watch ${movie.title} on MovieNest`,
  };
}

export default async function MoviePage({
  params,
}: {
  params: { moviename: string };
}) {
  const movieTitleFromSlug = decodeURIComponent(params.moviename).replace(/-/g, " ");
  const movie = await getMovieDetailsByTitle(movieTitleFromSlug);

  if (!movie) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        Movie not found or search failed.
      </div>
    );
  }

  // Note: Genres, runtime, etc., might not be available from the search result
  // based on the simplified Movie interface used here.
  // If you need them, you'd need to make a *second* API call to /movie/{id}
  // after getting the ID from the search result.

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
                {movie.release_date && <span>{new Date(movie.release_date).getFullYear()}</span>}
                {movie.release_date && movie.vote_average > 0 && <span> • </span>}
                {movie.vote_average > 0 && <span>{movie.vote_average.toFixed(1)} / 10 ⭐</span>}
                {/* Genres cannot be reliably displayed here from the search result */}
            </div>


            <div className="relative w-full mb-8" style={{ paddingTop: '56.25%' }}>
                {/* This iframe requires the movie ID, which we got from the search result */}
                {/* If search failed or got wrong movie, this iframe will be wrong or broken */}
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
                <p className="text-sm text-gray-300 leading-relaxed">{movie.overview || "No overview available."}</p>
            </div>
        </div>
      </div>
    </div>
  );
}