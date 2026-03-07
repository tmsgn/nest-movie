const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY!;
const BASE = "https://api.themoviedb.org/3";

// Generic cached fetch — 1 hour revalidation
async function tmdbFetch(path: string) {
  const res = await fetch(`${BASE}${path}?api_key=${API_KEY}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`TMDB ${path} failed (${res.status})`);
  return res.json();
}

type Genre = { id: number; name: string };

export type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  genres: string[];
  media_type: string;
  name: string;
};

export type TVShow = Movie & { media_type: "tv" };

export async function getTrendingMovies(): Promise<Movie[] | null> {
  try {
    const [{ results }, { genres }] = await Promise.all([
      tmdbFetch("/trending/movie/week"),
      tmdbFetch("/genre/movie/list"),
    ]);
    return results.map((m: any) => ({
      id: m.id,
      title: m.title ?? "Unknown",
      poster_path: m.poster_path ?? null,
      backdrop_path: m.backdrop_path ?? null,
      release_date: m.release_date ?? "",
      first_air_date: m.release_date ?? "",
      vote_average: m.vote_average,
      genre_ids: m.genre_ids ?? [],
      genres: (m.genre_ids ?? [])
        .map((id: number) => (genres as Genre[]).find((g) => g.id === id)?.name)
        .filter(Boolean),
      media_type: "movie",
      name: m.title ?? "Unknown",
    }));
  } catch {
    return null;
  }
}

export async function getTrendingTVShows(): Promise<TVShow[] | null> {
  try {
    const [{ results }, { genres }] = await Promise.all([
      tmdbFetch("/trending/tv/week"),
      tmdbFetch("/genre/tv/list"),
    ]);
    return results.map((t: any) => ({
      id: t.id,
      title: t.name ?? "Unknown",
      poster_path: t.poster_path ?? null,
      backdrop_path: t.backdrop_path ?? null,
      release_date: t.first_air_date ?? "",
      first_air_date: t.first_air_date ?? "",
      vote_average: t.vote_average,
      genre_ids: t.genre_ids ?? [],
      genres: (t.genre_ids ?? [])
        .map((id: number) => (genres as Genre[]).find((g) => g.id === id)?.name)
        .filter(Boolean),
      media_type: "tv",
      name: t.name ?? "Unknown",
    }));
  } catch {
    return null;
  }
}

export async function searchMovies(query: string) {
  try {
    // searchMovies is called client-side from Navbar, no cache needed
    const res = await fetch(
      `${BASE}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}`,
    );
    const data = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}

export async function getTvshowDetail(id: number) {
  try {
    return await tmdbFetch(`/tv/${id}`);
  } catch {
    return null;
  }
}

export async function getTvshowEpisodes(
  tvshowId: number,
  seasonNumber: number,
) {
  try {
    return await tmdbFetch(`/tv/${tvshowId}/season/${seasonNumber}`);
  } catch {
    return null;
  }
}

export async function RecommendedTvshows(tvshowId: number) {
  try {
    const data = await tmdbFetch(`/tv/${tvshowId}/recommendations`);
    return data.results ?? [];
  } catch {
    return [];
  }
}
