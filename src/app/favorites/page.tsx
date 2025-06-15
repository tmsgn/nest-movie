"use client";
import { loadFromLocalStorage } from "@/lib/savedata";
import React, { useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";

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

    useEffect(() => {
        const movies = loadFromLocalStorage<Movie[]>("movie");
        if (Array.isArray(movies)) {
            const normalized = movies.map((movie) => ({
                ...movie,
                genres: Array.isArray(movie.genres)
                    ? movie.genres.map((g: any) =>
                            typeof g === "string" ? g : g.name || JSON.stringify(g)
                        )
                    : [],
            }));
            setFavMovies(normalized);
        }
    }, []);
    const movieArray = Array.isArray(favMovies) ? favMovies : [];

    if (!favMovies.length) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="text-gray-400 text-lg font-semibold mt-10">
                    No favorites yet.
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold mb-6 text-center text-primary-700 dark:text-primary-300">
                Favorites
            </h2>
            <div className="grid lg:grid-cols-8 md:grid-cols-5 sm:grid-cols-4 grid-cols-2 gap-5">
                {movieArray.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default Favorites;
