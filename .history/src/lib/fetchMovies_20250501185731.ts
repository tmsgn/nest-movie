const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  genres: string[];
}

interface Genre {
  id: number;
  name: string;
}

interface MoviesResponse {
  results: Movie[];
}

interface GenresResponse {
  genres: Genre[];
}

export async function getTrendingMovies() {
  try {
    const moviesResponse = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
    );
    if (!moviesResponse.ok) {
      throw new Error("Failed to fetch trending movies");
    }
    const moviesData = (await moviesResponse.json()) as MoviesResponse;

    const genresResponse = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
    );
    if (!genresResponse.ok) {
      throw new Error("Failed to fetch genres");
    }
    const genresData = (await genresResponse.json()) as GenresResponse;

    const movies = moviesData.results.map((movie: Movie) => ({
      ...movie,
      genres: movie.genre_ids
        .map(
          (genreId: number) =>
            genresData.genres.find((genre: Genre) => genre.id === genreId)?.name
        )
        .filter(Boolean) as string[],
    }));

    return movies;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async
