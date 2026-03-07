import { Metadata } from "next";
import MovieCard from "@/components/MovieCard";
import { FiSearch } from "react-icons/fi";

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
type Genre = { id: number; name: string };
const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY!;

async function getMovieGenres(): Promise<Genre[]> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`,
    );
    return res.ok ? (await res.json()).genres : [];
  } catch {
    return [];
  }
}
async function getTVGenres(): Promise<Genre[]> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}`,
    );
    return res.ok ? (await res.json()).genres : [];
  } catch {
    return [];
  }
}
async function getSearchResults(query: string): Promise<Movie[]> {
  try {
    const [movieRes, tvRes] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`,
      ),
      fetch(
        `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`,
      ),
    ]);
    if (!movieRes.ok || !tvRes.ok) throw new Error();
    const [movieData, tvData] = await Promise.all([
      movieRes.json(),
      tvRes.json(),
    ]);
    const [movieGenres, tvGenres] = await Promise.all([
      getMovieGenres(),
      getTVGenres(),
    ]);
    const movies: Movie[] = (movieData.results as Movie[]).map((movie) => ({
      ...movie,
      media_type: "movie",
      genres: movie.genre_ids
        .map((id) => movieGenres.find((g) => g.id === id)?.name)
        .filter(Boolean) as string[],
    }));
    const tvShows: Movie[] = (tvData.results as TVShow[]).map((tv) => ({
      id: tv.id,
      title: tv.name,
      poster_path: tv.poster_path,
      release_date: tv.first_air_date,
      vote_average: tv.vote_average,
      overview: tv.overview,
      genre_ids: tv.genre_ids,
      genres: tv.genre_ids
        .map((id) => tvGenres.find((g) => g.id === id)?.name)
        .filter(Boolean) as string[],
      media_type: "tv",
    }));
    return [...movies, ...tvShows];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ searchname: string }>;
}): Promise<Metadata> {
  const title = decodeURIComponent((await params).searchname || "").replace(
    /-/g,
    " ",
  );
  return {
    title: `"${title}" – NestMovie Search`,
    description: `Search results for "${title}" on NestMovie.`,
  };
}

export default async function SearchPage({
  params,
}: {
  params: Promise<{ searchname: string }>;
}) {
  const searchQuery = ((await params).searchname || "").replace(/-/g, " ");
  const movies = await getSearchResults(searchQuery);
  const filtered = movies.filter((m) => m.poster_path);

  if (!filtered.length) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--clr-bg)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          paddingTop: 80,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
            border: "2px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FiSearch size={32} color="#8888a8" />
        </div>
        <h1
          style={{
            fontSize: "1.3rem",
            fontWeight: 800,
            color: "#fff",
            textAlign: "center",
          }}
        >
          No results for &ldquo;{searchQuery}&rdquo;
        </h1>
        <p
          style={{
            color: "#8888a8",
            fontSize: "0.88rem",
            textAlign: "center",
            maxWidth: 300,
          }}
        >
          Try different keywords or check your spelling.
        </p>
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 24px",
            background: "linear-gradient(135deg, #f5c518, #e8a800)",
            color: "#0a0a0f",
            borderRadius: 99,
            fontWeight: 700,
            fontSize: "0.88rem",
            textDecoration: "none",
          }}
        >
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "var(--clr-bg)",
        minHeight: "100vh",
        paddingTop: 68,
      }}
    >
      <div
        style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 16px 60px" }}
      >
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 6,
            }}
          >
            <FiSearch size={19} color="#f5c518" />
            <h1
              className="section-heading"
              style={{
                fontSize: "clamp(1.2rem, 3vw, 1.7rem)",
                fontWeight: 900,
                color: "#fff",
                margin: 0,
              }}
            >
              Search Results
            </h1>
          </div>
          <p style={{ color: "#8888a8", fontSize: "0.85rem", marginTop: 8 }}>
            Showing {filtered.length} result{filtered.length !== 1 ? "s" : ""}{" "}
            for{" "}
            <span style={{ color: "#f5c518", fontStyle: "italic" }}>
              &ldquo;{searchQuery}&rdquo;
            </span>
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: 14,
          }}
        >
          {filtered.map((movie) => (
            <MovieCard
              key={`${movie.media_type}-${movie.id}`}
              movie={{ ...movie, genres: movie.genres || [] }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
