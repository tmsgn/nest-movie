const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";

interface BaseMedia {
  id: number;
  poster_path: string | null;
  vote_average: number;
  genre_ids: number[];
  genres: string[];
  media_type: string; // "movie" | "tv"
}

interface Movie extends BaseMedia {
  title: string;
  release_date: string;
}

interface TVShow extends BaseMedia {
  title: string; // mapped from 'name'
  release_date: string; // mapped from 'first_air_date'
}

interface Genre {
  id: number;
  name: string;
}

interface MoviesResponse {
  results: Omit<Movie, "genres" | "media_type" | "title" | "release_date">[];
}

interface TVShowsResponse {
  results: Omit<TVShow, "genres" | "media_type" | "title" | "release_date">[];
}

interface GenresResponse {
  genres: Genre[];
}

// 🔥 Fetch trending movies
export async function getTrendingMovies(): Promise<Movie[]> {
  try {
    const [moviesRes, genresRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`),
      fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`),
    ]);

    if (!moviesRes.ok || !genresRes.ok) throw new Error("Failed to fetch movies or genres");

    const moviesData = (await moviesRes.json()) as MoviesResponse;
    const genresData = (await genresRes.json()) as GenresResponse;

    return moviesData.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      genre_ids: movie.genre_ids,
      genres: movie.genre_ids
        .map((id) => genresData.genres.find((g) => g.id === id)?.name)
        .filter(Boolean) as string[],
      media_type: "movie",
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

// 🔥 Fetch trending TV shows
export async function getTrendingTVShows(): Promise<TVShow[]> {
  try {
    const [tvRes, genresRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`),
      fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`),
    ]);

    if (!tvRes.ok || !genresRes.ok) throw new Error("Failed to fetch TV shows or genres");

    const tvData = (await tvRes.json()) as TVShowsResponse;
    const genresData = (await genresRes.json()) as GenresResponse;

    return tvData.results.map((tv) => ({
      id: tv.id,
      title: tv.name,
      poster_path: tv.poster_path,
      release_date: tv.first_air_date,
      vote_average: tv.vote_average,
      genre_ids: tv.genre_ids,
      genres: tv.genre_ids
        .map((id) => genresData.genres.find((g) => g.id === id)?.name)
        .filter(Boolean) as string[],
      media_type: "tv",
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

// 🔥 Search movies
async function searchMovies(query: string): Promise<Movie[]> {
  try {
    const [moviesRes, genresRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`),
      fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`),
    ]);

    if (!moviesRes.ok || !genresRes.ok) throw new Error("Failed to search movies or genres");

    const moviesData = (await moviesRes.json()) as MoviesResponse;
    const genresData = (await genresRes.json()) as GenresResponse;

    return moviesData.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
      genre_ids: movie.genre_ids,
      genres: movie.genre_ids
        .map((id) => genresData.genres.find((g) => g.id === id)?.name)
        .filter(Boolean) as string[],
      media_type: "movie",
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

// 🔥 Search TV shows
async function searchTVShows(query: string): Promise<TVShow[]> {
  try {
    const [tvRes, genresRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`),
      fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`),
    ]);

    if (!tvRes.ok || !genresRes.ok) throw new Error("Failed to search TV shows or genres");

    const tvData = (await tvRes.json()) as TVShowsResponse;
    const genresData = (await genresRes.json()) as GenresResponse;

    return tvData.results.map((tv) => ({
      id: tv.id,
      title: tv.name,
      poster_path: tv.poster_path,
      release_date: tv.first_air_date,
      vote_average: tv.vote_average,
      genre_ids: tv.genre_ids,
      genres: tv.genre_ids
        .map((id) => genresData.genres.find((g) => g.id === id)?.name)
        .filter(Boolean) as string[],
      media_type: "tv",
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

// 🔥 Combine search results
export async function getSearchResults(query: string): Promise<(Movie | TVShow)[]> {
  try {
    const [movies, tvShows] = await Promise.all([
      searchMovies(query),
      searchTVShows(query),
    ]);

    return [...movies, ...tvShows];
  } catch (err) {
    console.error("Error fetching combined search results:", err);
    return [];
  }
}

// 🔥 Fetch TV show details
export async function getTvshowDetail(id: number) {
  try {
    const res = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`);
    if (!res.ok) throw new Error("Failed to fetch TV show details");
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}
