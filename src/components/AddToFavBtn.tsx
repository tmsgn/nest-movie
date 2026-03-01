"use client";
import { saveToLocalStorage, loadFromLocalStorage } from "@/lib/savedata";
import React, { useState, useEffect } from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";

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

const AddToFavBtn = ({ movie }: { movie: Movie }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favMovies = loadFromLocalStorage<Movie[]>("movie") || [];
    setIsFavorite(favMovies.some((m) => m.id === movie.id));
  }, [movie.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let favMovies = loadFromLocalStorage<Movie[]>("movie") || [];
    if (isFavorite) {
      favMovies = favMovies.filter((m) => m.id !== movie.id);
    } else {
      favMovies.push(movie);
    }
    saveToLocalStorage("movie", favMovies);
    setIsFavorite(!isFavorite);
  };

  return (
    <button
      onClick={toggleFavorite}
      aria-label={isFavorite ? "Remove from watchlist" : "Add to watchlist"}
      title={isFavorite ? "Remove from watchlist" : "Add to watchlist"}
      style={{
        background: isFavorite ? "rgba(245,197,24,0.2)" : "rgba(10,10,20,0.7)",
        backdropFilter: "blur(8px)",
        border: `1px solid ${isFavorite ? "rgba(245,197,24,0.5)" : "rgba(255,255,255,0.2)"}`,
        borderRadius: 8,
        padding: "5px 6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.2s",
        outline: "none",
      }}
    >
      {isFavorite ? (
        <FaBookmark size={13} color="#f5c518" />
      ) : (
        <FaRegBookmark size={13} color="rgba(255,255,255,0.85)" />
      )}
    </button>
  );
};

export default AddToFavBtn;
