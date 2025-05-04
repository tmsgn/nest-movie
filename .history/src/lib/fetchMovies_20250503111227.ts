const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  genres: string[];
  media_type: string;
};

type TVShow = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  genres: string[];
  media_type: string;
};

type Genre = {
  id: number;
  name: string;
};

type MovieApiResponseItem = {
  media_type: string;
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
};

type TVShowApiResponseItem = {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
};

type GenresResponse = {
  genres: Genre[];
};

type MoviesResponse = {
  results: MovieApiResponseItem[];
};

type TVShowsResponse = {
  results: TVShowApiResponseItem[];
};

export async function getTrendingMovies() {
  try {
    const moviesResponse = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
    if (!moviesResponse.ok) throw new Error("Failed to fetch trending movies");
    const moviesData = (await moviesResponse.json()) as MoviesResponse;

    const genresResponse = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
    if (!genresResponse.ok) throw new Error("Failed to fetch movie genres");
    const genresData = (await genresResponse.json()) as GenresResponse;

    const movies: Movie[] = moviesData.results.map((movie) => ({
      ...movie,
      genres: movie.genre_ids.map((id) => genresData.genres.find((g) => g.id === id)?.name).filter(Boolean) as string[],
      media_type: "movie",
    }));

    return movies;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTrendingTVShows() {
  try {
    const tvResponse = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`);
    if (!tvResponse.ok) throw new Error("Failed to fetch trending TV shows");
    const tvData = (await tvResponse.json()) as TVShowsResponse;

    const genresResponse = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`);
    if (!genresResponse.ok) throw new Error("Failed to fetch TV genres");
    const genresData = (await genresResponse.json()) as GenresResponse;

    const tvShows: TVShow[] = tvData.results.map((tv) => ({
      id: tv.id,
      title: tv.name,
      poster_path: tv.poster_path,
      release_date: tv.first_air_date,
      vote_average: tv.vote_average,
      genre_ids: tv.genre_ids,
      genres: tv.genre_ids.map((id) => genresData.genres.find((g) => g.id === id)?.name).filter(Boolean) as string[],
      media_type: "tv",
    }));

    return tvShows;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function searchMovies(query: string) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
    if (!response.ok) throw new Error("Failed to fetch movies");
    const data = (await response.json()) as MoviesResponse;
    return data.results;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function searchTVShows(query: string) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${query}`);
    if (!response.ok) throw new Error("Failed to fetch TV shows");
    const data = (await response.json()) as TVShowsResponse;
    return data.results;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getSearchResults(query: string) {
  try {
    const [movieResults, tvResults] = await Promise.all([searchMovies(query), searchTVShows(query)]);

    const genresMovieResponse = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
    const genresTVResponse = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`);
    const [genresMovieData, genresTVData] = await Promise.all([genresMovieResponse.json(), genresTVResponse.json()]) as [GenresResponse, GenresResponse];

    const movies: Movie[] = (movieResults || []).map((movie) => ({
      ...movie,
      genres: movie.genre_ids.map((id) => genresMovieData.genres.find((g) => g.id === id)?.name).filter(Boolean) as string[],
      media_type: "movie",
    }));

    const tvShows: TVShow[] = (tvResults || []).map((tv) => ({
      id: tv.id,
      title: tv.name,
      poster_path: tv.poster_path,
      release_date: tv.first_air_date,
      vote_average: tv.vote_average,
      genre_ids: tv.genre_ids,
      genres: tv.genre_ids.map((id) => genresTVData.genres.find((g) => g.id === id)?.name).filter(Boolean) as string[],
      media_type: "tv",
    }));

    return [...movies, ...tvShows];
  } catch (error) {
    console.error("Error fetching combined results:", error);
    return [];
  }
}

export async function getTvshowDetail(id: number) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`);
    if (!response.ok) throw new Error("Failed to fetch TV show details");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
