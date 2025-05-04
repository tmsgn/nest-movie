"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type MovieSliderItem = {
    id: number;
    title?: string;
    name?: string;
    backdrop_path: string | null;
    release_date?: string;
    first_air_date?: string;
  };
  

  type Props = {
    movies: MovieSliderItem[];
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
    <div className="relative w-full  mx-auto mb-8">
      <Slider {...settings}>
        {movies
          .filter((movie) => movie.backdrop_path)
          .map((movie) => (
            <div
              key={movie.id}
              className="relative h-72 md:h-2x rounded-lg overflow-hidden"
            >
              <img
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title ?? movie.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                <h2 className="text-lg md:text-2xl font-bold text-yellow-400">
                  {movie.title ?? movie.name}
                </h2>
                <p className="text-sm text-gray-300">
                  {movie.release_date ?? movie.first_air_date ?? "Unknown date"}
                </p>
              </div>
            </div>
          ))}
      </Slider>
    </div>
  );
}
