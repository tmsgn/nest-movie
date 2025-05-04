"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaPlay } from "react-icons/fa";

type MovieSliderItem = {
  id: number;
  title?: string;
  name?: string;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  genre_names?: string[]; // optional list of genre names
  media_type?: string; // "movie" or "tv"
};

type Props = {
  movies: MovieSliderItem[];
};

export default function MovieSlider({ movies }: Props) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  return (
    <div className="relative w-full mx-auto mb-8">
      <Slider {...settings}>
        {movies.map((movie) => {
          const releaseYear =
            movie.release_date?.slice(0, 4) ||
            movie.first_air_date?.slice(0, 4) ||
            "Unknown";

          return (
            <div
              key={movie.id}
              className="relative min-h-72 md:h-[70vh] rounded-lg overflow-hidden"
            >
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title ?? movie.name ?? "Untitled"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 space-y-2">
                <h2 className="text-xl md:text-3xl font-bold text-yellow-400">
                  {movie.title ?? movie.name ?? "Untitled"}
                </h2>

                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-300">
                  <span className="px-2 py-0.5 bg-yellow-500/20 rounded">
                    {movie.media_type?.toUpperCase() ?? "MEDIA"}
                  </span>
                  <span>• {releaseYear}</span>
                  {movie.genre_names && movie.genre_names.length > 0 && (
                    <>
                      <span>•</span>
                      <span>{movie.genre_names.join(", ")}</span>
                    </>
                  )}
                </div>

                <button className="mt-2 flex w-fit cursor-pointer items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold shadow hover:bg-yellow-300 transition">
                  <FaPlay />
                  Play
                </button>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
}
