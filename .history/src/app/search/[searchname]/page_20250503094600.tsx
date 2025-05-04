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
  media_type: string;
};

type TVShow = {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
  overview: string;
  genre_ids: number[];
};

type Genre = {
  id: number;
  name: string;
};

const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";

async function getMovieGenres(): Promise<Genre[]> {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.genres as Genre[];
  } catch {
    return [];
  }
}

async function getTVGenres(): Promise<Genre[]> {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.genres as Genre[];
  } catch {
    return [];
  }
}

async function getSearchResults(query: string): Promise<Movie[]> {
  try {
    const [movieRes, tvRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`),
      fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
    ]);

    if (!movieRes.ok || !tvRes.ok) throw new Error();

    const [movieData, tvData] = await Promise.all([movieRes.json(), tvRes.json()]);
    const [movieGenres, tvGenres] = await Promise.all([getMovieGenres(), getTVGenres()]);

    const movies: Movie[] = (movieData.results as Movie[]).map(movie => ({
      ...movie,
      media_type: "movie",
      genres: movie.genre_ids.map(id => movieGenres.find(g => g.id === id)?.name).filter(Boolean) as string[]
    }));

    const tvShows: Movie[] = (tvData.results as TVShow[]).map(tv => ({
      id: tv.id,
      title: tv.name,
      poster_path: tv.poster_path,
      release_date: tv.first_air_date,
      vote_average: tv.vote_average,
      overview: tv.overview,
      genre_ids: tv.genre_ids,
      genres: tv.genre_ids.map(id => tvGenres.find(g => g.id === id)?.name).filter(Boolean) as string[],
      media_type: "tv"
    }));

    return [...movies, ...tvShows];
  } catch {
    return [];
  }
}

export function generateMetadata({ params }: { params: { searchname: string } }): Metadata {
  const title = decodeURIComponent(params.searchname || "");
  return {
    title: `Search result for: ${title}`,
    description: `Search results for ${title} on MovieNest`
  };
}

export default async function SearchPage({ params }: { params: { searchname: string } }) {
  const searchQuery = params.searchname?.replace(/-/g, " ") || "";
  const movies = await getSearchResults(searchQuery);

  if (!movies || movies.length === 0) {
    return (
      <div className="min-h-screen p-4">
        <div className="mx-auto">
          <h1 className="text-2xl font-bold mb-4">
            No results found for "{searchQuery}"
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Search Results for "{searchQuery}"
        </h1>
        <div className="grid lg:grid-cols-8 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-3">
          {movies.map(movie =>
            movie.poster_path && <MovieCard key={`${movie.media_type}-${movie.id}`} movie={movie} />
          )}
        </div>
      </div>
    </div>
  );
}
