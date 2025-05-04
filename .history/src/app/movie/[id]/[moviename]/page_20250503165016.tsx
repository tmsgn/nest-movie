import { Metadata } from "next";
import Image from "next/image"; // Need Image for displaying the poster
// MovieCard is not needed here as this page displays one movie detail, not a list item

// Interface for Movie Details (from the /movie/{id} endpoint)
interface MovieDetails {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
  genres: { id: number; name: string }[]; // Genres come as objects in details endpoint
  runtime?: number; // Optional, might not always be present or you might not use it yet
}

// Function to fetch movie details by ID
async function getMovieDetails(id: number): Promise<MovieDetails | null> {
  const API_KEY = process.env.TMDB_API_KEY; // Use environment variable
   if (!API_KEY) {
      console.error("TMDB_API_KEY is not set");
      return null; // Handle missing API key
  }
  // Use the correct TMDB endpoint for fetching details by ID
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
    // Consider caching options if needed: , { next: { revalidate: 3600 } } // Cache for 1 hour
  );

  if (!response.ok) {
      // Log error status if fetch failed
      console.error(`Failed to fetch movie details for ID ${id}: ${response.status} ${response.statusText}`);
      return null; // Return null if the movie is not found or API error
  }

  const data = await response.json();
  return data as MovieDetails;
}

// generateMetadata function to set page title and description
export async function generateMetadata({
  params,
}: {
  params: { movieid: string; movename: string }; // Access both parameters
}): Promise<Metadata> {
  const movieId = Number(params.movieid); // Get the ID and convert to number

  if (isNaN(movieId)) {
       return { title: "Invalid Movie ID" }; // Handle non-numeric ID
  }

  const movie = await getMovieDetails(movieId); // Fetch data for metadata

  if (!movie) {
    return {
        title: "Movie Not Found",
        description: "The requested movie could not be found.",
    };
  }

  // Use the actual movie title and overview from the fetched data
  return {
    title: movie.title,
    description: movie.overview ? movie.overview.substring(0, 150) + "..." : `Watch ${movie.title} on MovieNest`,
  };
}

// The main Page component
export default async function MoviePage({
  params,
}: {
  params: { movieid: string; movename: string }; // Access both parameters
}) {
  const movieId = Number(params.movieid); // Get the ID and convert to number

  // Basic validation for the ID from the URL
  if (isNaN(movieId)) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        Invalid Movie ID provided in the URL.
      </div>
    );
  }

  const movie = await getMovieDetails(movieId); // Fetch movie details using the ID

  if (!movie) {
    // If getMovieDetails returned null (e.g., 404 from API)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        Movie not found.
      </div>
    );
  }

  // Format genres for display
  const genreNames = movie.genres?.map(g => g.name).join(", ") || "N/A";


  return (
    // Use a structure suitable for a detail page, not a movie card list item
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-4">
      <div className="max-w-4xl w-full flex flex-col md:flex-row gap-8">

        {/* Poster Section */}
        <div className="flex-shrink-0 md:w-1/3 flex justify-center">
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={300} // Adjust size for detail page
              height={450} // Adjust size
              className="rounded-lg shadow-lg object-cover"
              priority // Prioritize loading the main image
            />
          ) : (
            <div className="w-[300px] h-[450px] bg-gray-700 rounded-lg flex items-center justify-center text-center">
              No Poster Available
            </div>
          )}
        </div>

        {/* Movie Info and Player Section */}
        <div className="flex-grow md:w-2/3">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>

            {/* Metadata line: Year, Rating, Genres */}
            <div className="text-gray-400 text-sm mb-4">
                {movie.release_date && <span>{new Date(movie.release_date).getFullYear()}</span>}
                {movie.release_date && movie.vote_average > 0 && <span> • </span>}
                {movie.vote_average > 0 && <span>{movie.vote_average.toFixed(1)} / 10 ⭐</span>}
                {genreNames !== "N/A" && <span> • {genreNames}</span>}
                {movie.runtime && <span> • {movie.runtime} min</span>} {/* Display runtime if available */}
            </div>


            {/* Video Player Container */}
            {/* Using padding-top trick for responsive 16:9 aspect ratio */}
            <div className="relative w-full mb-8" style={{ paddingTop: '56.25%' }}>
                {/* This iframe requires the movie ID - we got it from the URL parameter */}
                <iframe
                    src={`https://vidfast.pro/movie/${movie.id}`}
                    className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
                    allowFullScreen
                    sandbox="allow-scripts allow-same-origin allow-presentation" // Recommended sandbox attributes
                    title={`Video player for ${movie.title}`} // Accessibility improvement
                ></iframe>
            </div>


            {/* Overview Section */}
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-2">Overview</h2>
                <p className="text-sm text-gray-300 leading-relaxed">{movie.overview || "No overview available."}</p> {/* Handle missing overview */}
            </div>
        </div>
      </div>
    </div>
  );
}