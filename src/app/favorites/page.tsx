"use client";
import { loadFromLocalStorage } from "@/lib/savedata";
import React, { useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";
import { FiHeart } from "react-icons/fi";
import { MdBookmarkBorder } from "react-icons/md";

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

const Favorites = () => {
  const [favMovies, setFavMovies] = useState<Movie[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const movies = loadFromLocalStorage<Movie[]>("movie");
    if (Array.isArray(movies)) {
      const normalized = movies.map((movie) => ({
        ...movie,
        genres: Array.isArray(movie.genres)
          ? movie.genres.map((g: any) =>
              typeof g === "string" ? g : g.name || JSON.stringify(g),
            )
          : [],
      }));
      setFavMovies(normalized);
    }
  }, []);

  if (!mounted) return null;

  if (!favMovies.length) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--clr-bg)",
          paddingTop: 80,
          gap: 16,
        }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "rgba(245,197,24,0.08)",
            border: "2px solid rgba(245,197,24,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MdBookmarkBorder size={38} color="#f5c518" />
        </div>
        <h1
          style={{
            fontSize: "1.35rem",
            fontWeight: 800,
            color: "#fff",
            textAlign: "center",
          }}
        >
          Your Watchlist is Empty
        </h1>
        <p
          style={{
            color: "#8888a8",
            fontSize: "0.9rem",
            textAlign: "center",
            maxWidth: 320,
          }}
        >
          Browse movies and TV shows, then tap the bookmark icon to add them to
          your watchlist.
        </p>
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 28px",
            background: "linear-gradient(135deg, #f5c518, #e8a800)",
            color: "#0a0a0f",
            borderRadius: 99,
            fontWeight: 800,
            fontSize: "0.9rem",
            textDecoration: "none",
            boxShadow: "0 4px 20px rgba(245,197,24,0.4)",
            marginTop: 4,
          }}
        >
          Browse Movies
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
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 6,
            }}
          >
            <FiHeart size={20} color="#f5c518" />
            <h1
              className="section-heading"
              style={{
                fontSize: "clamp(1.3rem, 3vw, 1.9rem)",
                fontWeight: 900,
                color: "#fff",
                margin: 0,
              }}
            >
              My Watchlist
            </h1>
          </div>
          <p style={{ color: "#8888a8", fontSize: "0.85rem", marginTop: 8 }}>
            {favMovies.length} title{favMovies.length !== 1 ? "s" : ""} saved
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
            gap: 14,
          }}
        >
          {favMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
