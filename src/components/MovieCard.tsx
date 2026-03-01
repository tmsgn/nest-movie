"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AddToFavBtn from "./AddToFavBtn";
import { MdStar, MdLocalMovies, MdTv } from "react-icons/md";
import { FaPlay } from "react-icons/fa";

interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids?: number[];
  genres?: string[];
  media_type: "movie" | "tv" | string;
}

// Priority is passed from the parent — only the first ~6 cards should be priority
export default function MovieCard({
  movie,
  priority = false,
}: {
  movie: Movie;
  priority?: boolean;
}) {
  const itemTitle = movie.title || movie.name || "";
  const releaseDate = movie.release_date || movie.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const [loaded, setLoaded] = useState(false);

  const slug = itemTitle
    ? encodeURIComponent(
        itemTitle
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, ""),
      )
    : "detail";

  const href =
    movie.media_type === "tv"
      ? `/tv/${movie.id}/${slug}`
      : `/movie/${movie.id}/${slug}`;

  const firstGenre =
    movie.genres?.[0] ||
    (movie.genre_ids?.[0] ? `Genre ${movie.genre_ids[0]}` : null);

  const isTV = movie.media_type === "tv";

  return (
    <Link
      href={href}
      style={{ display: "block", textDecoration: "none" }}
      className="movie-card-link"
    >
      <div className="movie-card-inner">
        {/* Poster */}
        <div
          style={{
            position: "relative",
            aspectRatio: "2/3",
            background: "var(--clr-surface2)",
          }}
        >
          {!loaded && (
            <div
              className="skeleton"
              style={{ position: "absolute", inset: 0, borderRadius: 0 }}
            />
          )}
          <Image
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                : "/fallback.jpg"
            }
            alt={`${itemTitle} Poster`}
            onLoad={() => setLoaded(true)}
            fill
            sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 12vw"
            style={{
              objectFit: "cover",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.35s ease",
            }}
            // Only priority if parent says so (first ~6 visible cards)
            priority={priority}
            // Use lazy loading for non-priority cards
            loading={priority ? "eager" : "lazy"}
          />

          {/* Hover overlay — CSS only, no JS state */}
          <div className="movie-card-overlay">
            <div className="movie-card-play-btn">
              <FaPlay size={15} color="#0a0a0f" style={{ marginLeft: 2 }} />
            </div>
          </div>

          {/* Favorite button */}
          <div
            style={{ position: "absolute", top: 6, right: 6, zIndex: 10 }}
            onClick={(e) => e.preventDefault()}
          >
            <AddToFavBtn movie={movie} />
          </div>

          {/* Media type badge */}
          <div
            style={{
              position: "absolute",
              top: 6,
              left: 6,
              background: isTV
                ? "rgba(96,165,250,0.25)"
                : "rgba(245,197,24,0.25)",
              border: `1px solid ${isTV ? "rgba(96,165,250,0.4)" : "rgba(245,197,24,0.4)"}`,
              borderRadius: 6,
              padding: "2px 6px",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            {isTV ? (
              <MdTv size={10} color="#60a5fa" />
            ) : (
              <MdLocalMovies size={10} color="#f5c518" />
            )}
            <span
              style={{
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                color: isTV ? "#60a5fa" : "#f5c518",
              }}
            >
              {isTV ? "TV" : "FILM"}
            </span>
          </div>
        </div>

        {/* Info area */}
        <div style={{ padding: "8px 10px 10px" }}>
          {!loaded ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div
                className="skeleton"
                style={{ height: 11, width: "40%", borderRadius: 4 }}
              />
              <div
                className="skeleton"
                style={{ height: 13, width: "90%", borderRadius: 4 }}
              />
              <div
                className="skeleton"
                style={{ height: 10, width: "60%", borderRadius: 4 }}
              />
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 3,
                }}
              >
                {releaseYear && (
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "#8888a8",
                      fontWeight: 500,
                    }}
                  >
                    {releaseYear}
                  </span>
                )}
                {movie.vote_average > 0 && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 2,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "#f5c518",
                    }}
                  >
                    <MdStar size={12} />
                    {movie.vote_average.toFixed(1)}
                  </span>
                )}
              </div>
              <p
                style={{
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  color: "#e8e8f0",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginBottom: 3,
                  lineHeight: 1.3,
                }}
              >
                {itemTitle}
              </p>
              {firstGenre && (
                <p
                  style={{
                    fontSize: "0.7rem",
                    color: "#8888a8",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {firstGenre}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
