"use client"; // REQUIRED for client-side only libraries

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface Movie {
  id: number;
  title: string;
  name?: string;
  backdrop_path: string | null;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
}

type Props = {
  movies: Movie[];
};

export default function MovieSlider({ movies }: Props) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto mb-8">
      <Slider {...settings}>
        {movies
          .filter((movie) => movie.backdrop_path)
          .map((movie) => (
            <div
              key={movie.id}
              className="relative h-72 md:h-96 rounded-lg overflow-hidden"
            >
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title ?? movie.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4">
                <h2 className="text-xl md:text-3xl font-bold text-yellow-400">
                  {movie.title ?? movie.name}
                </h2>
                <p className="text-sm text-gray-200">
                  {movie.release_date ?? movie.first_air_date ?? "Unknown Date"}
                </p>
              </div>
            </div>
          ))}
      </Slider>
    </div>
  );
}
