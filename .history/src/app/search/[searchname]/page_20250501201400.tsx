import { Metadata } from "next";
import MovieCard from "@/components/MovieCard";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
  genres?: string[];
};

type Genre = {
  id: number;
  name: string;
};

async function getGenres() {
  try {
    const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch genres");
    }
    const data = await response.json();
    return data.genres as Genre[];
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

async function getSearchResults(query: string) {
  try {
    const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch search results");
    }
    const data = await response.json();
    const movies = data.results as Movie[];

    const genres = await getGenres();

    return movies.map((movie) => ({
      ...movie,
      genres: movie.genre_ids
        .map((genreId) => genres.find((g: Genre) => g.id === genreId)?.name)
        .filter(Boolean) as string[],
    }));
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

export function generateMetadata({
  params,
}: {
  params: { searchname: string };
}): Metadata {
  const title = decodeURIComponent(params.searchname);
  return {
    title: `Search result for: ${title}`,
    description: `Search results for ${title} on MovieNest`,
  };
}

export default async function SearchPage({
  params,
}: {
  params: { searchname: string };
}) {
  const searchQuery = params.searchname.replace(/-/g, " ");
  const movies = await getSearchResults(searchQuery);

  if (!movies || movies.length === 0) {
    return (
      <div className="min-h-screen  p-4">
        <div className=" mx-auto">
          <h1 className="text-2xl font-bold mb-4">
            No movies found for "{searchQuery}"
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  e p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Search Results for "{searchQuery}"
        </h1>
        <div className="grid lg:grid-cols-8 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-3">
          {movies.map(
            (movie) =>
              movie.poster_path && <MovieCard key={movie.id} movie={movie} />
          )}
        </div>
      </div>
    </div>
  );
}
