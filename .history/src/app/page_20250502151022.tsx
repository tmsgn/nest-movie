import { getTrendingMovies } from "@/lib/fetchMovies";
import MovieCard from "@/components/MovieCard";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: string[];
}

export async function getTrendingMovies() {
  try {
    const API_KEY = "your_api_key_here";
    const response = await fetch(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`,
      { next: { revalidate: 60 } } 
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    const data = await response.json();
    return data.results as Movie[];
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return null; 
  }
}
