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
      onClick={(e) => { e.preventDefault(); toggleFavorite(); }}
      className="bg-transparent cursor-pointer border-none p-0 m-0 flex items-center justify-center"
      aria-label={isFavorite ? "Remove from saved" : "Save"}
      title={isFavorite ? "Remove from saved" : "Save"}
      style={{ background: "none", border: "none" }}
    >
      {isFavorite ? (
        <FaBookmark className="text-blue-600 text-xl" />
      ) : (
        <FaRegBookmark className="text-gray-600 text-xl hover:text-blue-600 transition" />
      )}
    </button>
  );
};

export default AddToFavBtn;