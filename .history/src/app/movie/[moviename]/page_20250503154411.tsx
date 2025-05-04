// app/movie/[movieId]/page.tsx

import { Metadata } from "next";
import Image from "next/image"; // Import Image component

// It's best practice to define interfaces in a shared place,
// but for now, let's make this one more complete
interface MovieDetails {
  id: number;
  title: string;
  poster_path: string | null; // poster_path can be null
  release_date: string;
  vote_average: number;
  overview: string;
  genres: { id: number; name: string }[]; // TMDB genre format
  runtime: number; // Example of another useful field
  // Add other fields you might need from the details endpoint
}

async function getMovieDetails(id: number): Promise<MovieDetails | null> { // Expect number ID, return MovieDetails or null
  const API_KEY = process.env.TMDB_API_KEY; // Use environment variable for API Key
  if (!API_KEY) {
      console.error("TMDB_API_KEY is not set");
      return null;
  }
  // Use the /movie/{movie_id} endpoint
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos,genres` // Added append_to_response for genres if needed later
  );

  if (!response.ok) {
      console.error("Failed to fetch movie details:", response.statusText);
      return null; // Return null or throw error if fetch fails
  }

  const data = await response.json();
  // The structure from /movie/{id} is directly the movie object
  return data as MovieDetails;
}

// generateMetadata should fetch data to get the actual title
export async function generateMetadata({
  params,
}: {
  params: { movieId: string }; // Expect movieId string from params
}): Promise<Metadata> { // Use Promise<Metadata> because it's async
  const movieId = Number(params.movieId); // Convert id string to number
  const movie = await getMovieDetails(movieId); // Fetch data for metadata

  if (!movie) {
    return {
        title: "Movie Not Found",
        description: "The requested movie could not be found.",
    };
  }

  // Use the actual movie title from the fetched data
  return {
    title: movie.title,
    description: movie.overview ? movie.overview.substring(0, 150) + "..." : `Watch ${movie.title} on MovieNest`, // Use overview for description
  };
}

export default async function MoviePage({
  params,
}: {
  params: { movieId: string }; // Expect movieId string from params
}) {
  const movieId = Number(params.movieId); // Convert id string to number
  const movie = await getMovieDetails(movieId); // Fetch movie details

  if (!movie) {
    // Render a not-found or error state
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        Movie not found.
      </div>
    );
  }

  // You might want to extract genres properly if you need them here
  const genreNames = movie.genres?.map(g => g.name).join(", ") || "N/A";


  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-4">
      <div className="max-w-4xl w-full flex flex-col md:flex-row gap-8"> {/* Use flex for layout */}

        {/* Poster on the side for larger screens */}
        <div className="flex-shrink-0 md:w-1/3 flex justify-center">
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={300} // Adjust size for detail page display
              height={450} // Adjust size
              className="rounded-lg shadow-lg object-cover"
            />
          ) : (
            <div className="w-[300px] h-[450px] bg-gray-700 rounded-lg flex items-center justify-center text-center">
              No Poster Available
            </div>
          )}
        </div>

        {/* Movie Info and Player */}
        <div className="flex-grow md:w-2/3">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>

            <div className="text-gray-400 text-sm mb-4">
                {movie.release_date && <span>{new Date(movie.release_date).getFullYear()}</span>}
                {movie.release_date && movie.vote_average > 0 && <span> • </span>}
                {movie.vote_average > 0 && <span>{movie.vote_average.toFixed(1)} / 10 ⭐</span>}
                 {genreNames !== "N/A" && <span> • {genreNames}</span>} {/* Display genres */}
            </div>


            {/* Video Player Section */}
            {/* Use a responsive container for the iframe */}
            {/* Removed fixed height, relying on padding-bottom for aspect ratio */}
            <div className="relative w-full mb-8" style={{ paddingTop: '56.25%' }}> {/* 16:9 Aspect Ratio */}
                <iframe
                    src={`https://vidfast.pro/movie/${movie.id}`} // This now reliably uses the fetched movie ID
                    className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md" // iframe fills the parent's padded space
                    allowFullScreen
                    sandbox="allow-scripts allow-same-origin allow-presentation"
                    title={`Video player for ${movie.title}`} // Good for accessibility
                ></iframe>
            </div>


            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-2">Overview</h2>
                <p className="text-sm text-gray-300 leading-relaxed">{movie.overview || "No overview available."}</p> {/* Handle missing overview */}
            </div>
        </div>
      </div>
    </div>
  );
}