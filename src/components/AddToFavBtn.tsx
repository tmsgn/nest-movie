"use client";
import { saveToLocalStorage, loadFromLocalStorage } from "@/lib/savedata";
import React, { useState, useEffect } from "react";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";

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

  const toggleFavorite = () => {
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
      onClick={(e) => {
        e.preventDefault();
        toggleFavorite();
      }}
      className="absolute top-2 right-2 z-10 bg-transparent border-none p-0 m-0 flex items-center justify-center transition-transform hover:scale-110"
      aria-label={isFavorite ? "Remove from saved" : "Save"}
      title={isFavorite ? "Remove from saved" : "Save"}
      style={{ background: "none", border: "none" }}
    >
      {isFavorite ? (
        <FaBookmark className="text-yellow-400 text-2xl drop-shadow" />
      ) : (
        <FaRegBookmark className="text-white text-2xl hover:text-yellow-400 drop-shadow" />
      )}
    </button>
  );
};

export default AddToFavBtn;