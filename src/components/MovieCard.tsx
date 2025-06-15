'use client'
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import AddToFavBtn from "./AddToFavBtn";

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

export default function MovieCard({ movie }: { movie: Movie }) {
  const itemTitle = movie.title || movie.name || "";
  const releaseDate = movie.release_date || movie.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const [loading, setLoading]= useState(false)

  const slug = itemTitle
    ? encodeURIComponent(
        itemTitle
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "")
      )
    : "detail";

  const href =
    movie.media_type === "tv"
      ? `/tv/${movie.id}/${slug}`
      : movie.media_type === "movie"
      ? `/movie/${movie.id}/${slug}`
      : `/movie/${movie.id}/${slug}`;

  

  const firstGenreDisplay = movie.genres?.[0] || (movie.genre_ids?.[0] ? `Genre ${movie.genre_ids[0]}` : null);

  return (
    <Link href={href} className="group block h-full">
      <div className="cursor-pointer rounded-lg p-1 group transition-transform transform hover:scale-105 relative h-full flex flex-col">
      <div className="relative flex-shrink-0">
        {!loading && (
        <div className="animate-pulse bg-gray-300 rounded-lg w-full" style={{ aspectRatio: '500/700', minHeight: 200 }} />
        )}
        <Image
        src={
          movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "/fallback.jpg"
        }
        alt={`${itemTitle} Poster`}
        onLoad={() => setLoading(true)}
        width={500}
        height={700}
        className={`object-cover group-hover:opacity-60 rounded-lg w-full h-auto ${!loading ? 'hidden' : ''}`}
        priority
        />
      </div>
      <div className="mt-2 flex-grow flex flex-col justify-between">
        {!loading ? (
        <div className="space-y-2">
          <div className="h-3 w-12 bg-gray-300 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse" />
          <div className="flex gap-2">
          <div className="h-3 w-16 bg-gray-300 rounded animate-pulse" />
          <div className="h-3 w-8 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
        ) : (
        <>
          {releaseYear && (
          <h1 className="text-xs flex justify-between md:text-sm font-medium text-gray-400 ">
            {releaseYear}
            <AddToFavBtn movie={movie} />
          </h1>
          )}
          <div className="flex flex-col gap-1">
          <h1 className="font-semibold truncate text-xs md:text-base">
            {itemTitle}
          </h1>
          <div className="flex justify-between items-center md:flex-nowrap flex-wrap gap-1">
            {firstGenreDisplay && (
            <h1 className="md:text-sm w-full text-gray-500 break-words text-xs font-medium truncate flex-shrink overflow-hidden">
              {firstGenreDisplay}
            </h1>
            )}
            {movie.vote_average > 0 && (
            <h1 className="text-xs flex-shrink-0">
              {movie.vote_average.toFixed(1)}⭐
            </h1>
            )}
          </div>
          </div>
        </>
        )}
      </div>
      </div>
    </Link>
  );
}
