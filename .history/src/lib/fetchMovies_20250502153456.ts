const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";

interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  genres: string[];
}

interface TVShowsResponse {
  results: TVShow[];
}

export async function getTrendingTVShows() {
  try {
    const tvShowsResponse = await fetch(
      `https://api.themoviedb.org/3/trending/tv/week?api_key=${API_KEY}`
    );
    if (!tvShowsResponse.ok) {
      throw new Error("Failed to fetch trending TV shows");
    }
    const tvShowsData = (await tvShowsResponse.json()) as TVShowsResponse;

    const genresResponse = await fetch(
      `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`
    );
    if (!genresResponse.ok) {
      throw new Error("Failed to fetch TV genres");
    }
    const genresData = (await genresResponse.json()) as GenresResponse;

    const tvShows = tvShowsData.results.map((tvShow: TVShow) => ({
      ...tvShow,
      genres: tvShow.genre_ids
        .map(
          (genreId: number) =>
            genresData.genres.find((genre: Genre) => genre.id === genreId)?.name
        )
        .filter(Boolean) as string[],
    }));

    return tvShows;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function searchTVShows(query: string) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${query}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch TV shows");
    }
    const data = (await response.json()) as TVShowsResponse;
    return data.results;
  } catch (error) {
    console.error(error);
    return null;
  }
}
