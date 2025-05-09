import axios from 'axios';

const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";

type Genre = { id: number; name: string };

type Movie = {
  first_air_date: any;
  name: any;
  backdrop_path: null;
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  genres: string[];
  media_type: string;
};

type TVShow = Movie & { media_type: "tv" };

type ApiResponseItem = {
  backdrop_path: null;
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids: number[];
  media_type?: string;
};

type GenresResponse = { genres: Genre[] };
type MoviesResponse = { results: ApiResponseItem[] };

export async function getTrendingMovies(): Promise<Movie[] | null> {
  try {
    const [moviesRes, genresRes] = await Promise.all([
      axios.get<MoviesResponse>(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`),
      axios.get<GenresResponse>(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`)
    ]);
    const moviesData = moviesRes.data;
    const genresData = genresRes.data;
    return moviesData.results.map(movie => ({
      id: movie.id,
      title: movie.title ?? "Unknown Title",
      poster_path: movie.poster_path,
      release_date: movie.release_date ?? "Unknown",
      vote_average: movie.vote_average,
      genre_ids: movie.genre_ids,
      genres: movie.genre_ids.map(id => genresData.genres.find(g => g.id === id)?.name).filter(Boolean) as string[],
      media_type: "movie",
      first_air_date: movie.release_date ?? "Unknown",
      name: movie.title ?? "Unknown Name",
      backdrop_path: movie.backdrop_path ?? null
    }));
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTrendingTVShows(): Promise<TVShow[] | null> {
  try {
    const [tvRes, genresRes] = await Promise.all([
      axios.get<MoviesResponse>(`https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`),
      axios.get<GenresResponse>(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`)
    ]);
    const tvData = tvRes.data;
    const genresData = genresRes.data;
    return tvData.results.map(tv => ({
      id: tv.id,
      title: tv.name ?? "Unknown Title",
      poster_path: tv.poster_path,
      release_date: tv.first_air_date ?? "Unknown",
      vote_average: tv.vote_average,
      genre_ids: tv.genre_ids,
      genres: tv.genre_ids.map(id => genresData.genres.find(g => g.id === id)?.name).filter(Boolean) as string[],
      media_type: "tv",
      first_air_date: tv.first_air_date ?? "Unknown",
      name: tv.name ?? "Unknown Name",
      backdrop_path: tv.backdrop_path ?? null
    }));
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function searchMovies(query: string): Promise<ApiResponseItem[]> {
  try {
    const res = await axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    return res.data.results.map((item: ApiResponseItem) => ({
      id: item.id,
      title: item.title ?? item.name ?? "Unknown Title",
      poster_path: item.poster_path,
      release_date: item.release_date ?? item.first_air_date ?? "Unknown",
      media_type: item.media_type ?? "movie"
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTvshowDetail(id: number) {
  try {
    const res = await axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getTvshowEpisodes(tvshowId: number, seasonNumber: number) {
  try {
    const res = await axios.get(`https://api.themoviedb.org/3/tv/${tvshowId}/season/${seasonNumber}?api_key=${API_KEY}&language=en-US`);
    return res.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function RecommendedTvshows(tvshowId: number) {
  try {
    const res = await axios.get(`https://api.themoviedb.org/3/tv/${tvshowId}/recommendations?api_key=${API_KEY}`);
    return res.data.results;
  } catch (error) {
    console.error(error);
    return null;
  }
}
