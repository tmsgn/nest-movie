import { Metadata } from "next";
import { MdStar, MdCalendarToday, MdLocalMovies } from "react-icons/md";
import { FaGlobe } from "react-icons/fa";
import MoviePlayerClient from "./MoviePlayerClient";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY!;
const TMDB_BASE = "https://api.themoviedb.org/3";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  overview: string;
  runtime?: number;
  genres?: { id: number; name: string }[];
  original_language?: string;
  tagline?: string;
};

type CastMember = {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
};

type RecommendedMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
};

async function tmdbFetch(path: string) {
  const res = await fetch(`${TMDB_BASE}${path}?api_key=${API_KEY}`, {
    next: { revalidate: 3600 }, // cache 1 hour
  });
  if (!res.ok) throw new Error(`TMDB fetch failed: ${path}`);
  return res.json();
}

async function getMovieDetails(id: string): Promise<Movie | null> {
  try {
    return await tmdbFetch(`/movie/${id}`);
  } catch {
    return null;
  }
}
async function getMovieCast(id: string): Promise<CastMember[]> {
  try {
    const data = await tmdbFetch(`/movie/${id}/credits`);
    return (data.cast || []).slice(0, 8);
  } catch {
    return [];
  }
}
async function getRecommended(id: string): Promise<RecommendedMovie[]> {
  try {
    const data = await tmdbFetch(`/movie/${id}/recommendations`);
    return (data.results || []).slice(0, 8);
  } catch {
    return [];
  }
}

type Props = { params: Promise<{ id: string; moviename: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { moviename } = await params;
  const title = decodeURIComponent(moviename).replace(/-/g, " ");
  const formatted = title.charAt(0).toUpperCase() + title.slice(1);
  return {
    title: `${formatted} – NestMovie`,
    description: `Watch ${formatted} online for free on NestMovie.`,
  };
}

export default async function MoviePage({ params }: Props) {
  const { id } = await params;

  // Parallel fetch — fast
  const [movie, cast, recommended] = await Promise.all([
    getMovieDetails(id),
    getMovieCast(id),
    getRecommended(id),
  ]);

  if (!movie) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--clr-bg)",
          gap: 16,
          paddingTop: 80,
        }}
      >
        <div style={{ fontSize: "3rem" }}>🎬</div>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#f5c518" }}>
          Movie Not Found
        </h1>
        <p style={{ color: "#8888a8" }}>
          This title could not be loaded right now.
        </p>
        <a
          href="/"
          style={{
            padding: "10px 24px",
            borderRadius: 99,
            background: "linear-gradient(135deg,#f5c518,#e8a800)",
            color: "#0a0a0f",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          ← Home
        </a>
      </div>
    );
  }

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "—";
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  return (
    <div
      style={{
        background: "var(--clr-bg)",
        minHeight: "100vh",
        paddingTop: 68,
      }}
    >
      {/* ── Hero Banner ── */}
      {movie.backdrop_path && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "clamp(200px, 42vh, 480px)",
            overflow: "hidden",
            background: "#0a0a0f",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
            alt={movie.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
              filter: "brightness(0.45) saturate(1.1)",
            }}
            loading="eager"
            // @ts-ignore
            fetchpriority="high"
            decoding="async"
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top,rgba(10,10,20,1) 0%,rgba(10,10,20,0.5) 55%,transparent 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right,rgba(10,10,20,0.85) 0%,transparent 60%)",
            }}
          />
        </div>
      )}

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px 60px" }}>
        {/* ── Title card ── */}
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: movie.backdrop_path ? -110 : 24,
            position: "relative",
            zIndex: 10,
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          {/* Poster */}
          {movie.poster_path && (
            <div
              style={{
                width: "clamp(110px,14vw,190px)",
                flexShrink: 0,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 8px 40px rgba(0,0,0,0.75)",
                border: "2px solid rgba(255,255,255,0.1)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={movie.title}
                style={{ width: "100%", height: "auto", display: "block" }}
                loading="eager"
                // @ts-ignore
                fetchpriority="high"
              />
            </div>
          )}

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0, paddingBottom: 8 }}>
            {movie.tagline && (
              <p
                style={{
                  color: "#f5c518",
                  fontSize: "0.82rem",
                  fontStyle: "italic",
                  marginBottom: 6,
                  opacity: 0.8,
                }}
              >
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}
            <h1
              style={{
                fontSize: "clamp(1.5rem,3vw,2.6rem)",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                marginBottom: 12,
              }}
            >
              {movie.title}
            </h1>
            {/* Meta row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: "rgba(245,197,24,0.15)",
                  border: "1px solid rgba(245,197,24,0.4)",
                  borderRadius: 8,
                  padding: "4px 12px",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#f5c518",
                }}
              >
                <MdStar size={14} />
                {movie.vote_average.toFixed(1)}
                <span
                  style={{
                    color: "#8888a8",
                    fontWeight: 400,
                    fontSize: "0.75rem",
                  }}
                >
                  ({movie.vote_count.toLocaleString()})
                </span>
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  color: "#8888a8",
                  fontSize: "0.85rem",
                }}
              >
                <MdCalendarToday size={12} />
                {year}
              </span>
              {runtime && (
                <span style={{ color: "#8888a8", fontSize: "0.85rem" }}>
                  {runtime}
                </span>
              )}
              {movie.original_language && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    color: "#8888a8",
                    fontSize: "0.82rem",
                  }}
                >
                  <FaGlobe size={11} />
                  {movie.original_language.toUpperCase()}
                </span>
              )}
              <span
                style={{
                  background: "linear-gradient(135deg,#f5c518,#e8a800)",
                  color: "#0a0a0f",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  padding: "3px 8px",
                  borderRadius: 5,
                }}
              >
                HD
              </span>
            </div>
            {/* Genre pills */}
            {movie.genres && movie.genres.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {movie.genres.map((g) => (
                  <span
                    key={g.id}
                    style={{
                      padding: "4px 12px",
                      borderRadius: 99,
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      background: "rgba(255,255,255,0.08)",
                      color: "rgba(232,232,240,0.75)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Overview ── */}
        {movie.overview && (
          <div style={{ marginTop: 24 }}>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#f5c518",
                marginBottom: 8,
              }}
            >
              Overview
            </h2>
            <p
              style={{
                color: "rgba(232,232,240,0.75)",
                lineHeight: 1.75,
                fontSize: "0.92rem",
                maxWidth: 780,
              }}
            >
              {movie.overview}
            </p>
          </div>
        )}

        {/* ── Player — client component, receives only plain serializable data ── */}
        <div style={{ marginTop: 28 }}>
          <MoviePlayerClient movieId={movie.id} />
        </div>

        {/* ── Cast ── */}
        {cast.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2
              className="section-heading"
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#fff",
                marginBottom: 20,
              }}
            >
              Cast
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))",
                gap: 14,
              }}
            >
              {cast.map((member) => (
                <div
                  key={member.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: "50%",
                      overflow: "hidden",
                      background: "var(--clr-surface2)",
                      border: "2px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        member.profile_path
                          ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=1a1a26&color=8888a8&size=70`
                      }
                      alt={member.name}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "#e8e8f0",
                        lineHeight: 1.2,
                      }}
                    >
                      {member.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.68rem",
                        color: "#8888a8",
                        marginTop: 1,
                      }}
                    >
                      {member.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Recommended ── */}
        {recommended.length > 0 && (
          <div style={{ marginTop: 48 }}>
            <div className="divider" />
            <h2
              className="section-heading"
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#fff",
                marginBottom: 20,
              }}
            >
              You Might Also Like
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))",
                gap: 14,
              }}
            >
              {recommended.map((rec) => {
                const rSlug = encodeURIComponent(
                  (rec.title || "movie").toLowerCase().replace(/\s+/g, "-"),
                );
                return (
                  <a
                    key={rec.id}
                    href={`/movie/${rec.id}/${rSlug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        borderRadius: 10,
                        overflow: "hidden",
                        background: "var(--clr-surface)",
                        transition: "all 0.3s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform =
                          "translateY(-5px) scale(1.03)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform =
                          "scale(1)";
                      }}
                    >
                      {rec.poster_path ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`https://image.tmdb.org/t/p/w342${rec.poster_path}`}
                          alt={rec.title}
                          loading="lazy"
                          style={{
                            width: "100%",
                            aspectRatio: "2/3",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            aspectRatio: "2/3",
                            background: "var(--clr-surface2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <MdLocalMovies size={28} color="#8888a8" />
                        </div>
                      )}
                      <div style={{ padding: "8px 10px" }}>
                        <p
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            color: "#e8e8f0",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {rec.title}
                        </p>
                        <p
                          style={{
                            fontSize: "0.7rem",
                            color: "#8888a8",
                            marginTop: 2,
                          }}
                        >
                          {rec.release_date?.slice(0, 4) || "—"}
                        </p>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
