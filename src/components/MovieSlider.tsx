"use client";
import Slider from "react-slick";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import { MdStar } from "react-icons/md";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";
import Image from "next/image";

type MovieSliderItem = {
  vote_average: ReactNode;
  id: number;
  title?: string;
  name?: string;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  genre_names?: string[];
  media_type?: string;
};

type Props = { movies: MovieSliderItem[] };

function slugify(text?: string) {
  return text
    ? text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    : "unknown";
}

export default function MovieSlider({ movies }: Props) {
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);

  // Limit to first 8 items — no need to preload 20 large hero images
  const sliderMovies = movies.slice(0, 8);

  const handlePlay = (movie: MovieSliderItem) => {
    if (movie.media_type === "movie") {
      router.push(`/movie/${movie.id}/${slugify(movie.title || movie.name)}`);
    } else if (movie.media_type === "tv") {
      router.push(`/tv/${movie.id}/${slugify(movie.name || movie.title)}`);
    }
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: false,
    pauseOnHover: true,
    lazyLoad: "ondemand" as const,
    beforeChange: (_: number, next: number) => setActiveIdx(next),
  };

  return (
    <div style={{ position: "relative", width: "100%", marginBottom: 40 }}>
      <Slider {...settings}>
        {sliderMovies.map((movie, idx) => {
          const releaseYear =
            movie.release_date?.slice(0, 4) ||
            movie.first_air_date?.slice(0, 4) ||
            "";
          const title = movie.title ?? movie.name ?? "Untitled";
          const genres = movie.genre_names?.slice(0, 3) || [];

          return (
            <div key={movie.id}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "clamp(280px, 70vh, 680px)",
                  overflow: "hidden",
                  background: "#0a0a0f",
                }}
              >
                {/* Backdrop — use w1280 (not /original) and Next.js Image optimization */}
                {movie.backdrop_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
                    alt={title}
                    fill
                    sizes="100vw"
                    // Only the first slide gets priority loading, the rest lazy-load
                    priority={idx === 0}
                    style={{
                      objectFit: "cover",
                      objectPosition: "center top",
                      filter: "brightness(0.55) saturate(1.1)",
                      transform: idx === activeIdx ? "scale(1.03)" : "scale(1)",
                      transition: "transform 8s ease",
                    }}
                  />
                )}

                {/* Gradient overlays */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to right, rgba(10,10,20,0.92) 0%, rgba(10,10,20,0.55) 50%, rgba(10,10,20,0.2) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(10,10,20,0.95) 0%, rgba(10,10,20,0.25) 55%, transparent 100%)",
                  }}
                />

                {/* Content */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "clamp(24px, 4vw, 56px)",
                    paddingTop: 0,
                  }}
                >
                  {/* Type badge */}
                  <div style={{ marginBottom: 10 }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "4px 12px",
                        borderRadius: 99,
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        background:
                          movie.media_type === "tv"
                            ? "rgba(96,165,250,0.18)"
                            : "rgba(245,197,24,0.18)",
                        color:
                          movie.media_type === "tv" ? "#60a5fa" : "#f5c518",
                        border: `1px solid ${movie.media_type === "tv" ? "rgba(96,165,250,0.35)" : "rgba(245,197,24,0.35)"}`,
                      }}
                    >
                      {movie.media_type === "tv" ? "TV Show" : "Movie"}
                    </span>
                  </div>

                  {/* Title */}
                  <h2
                    style={{
                      fontSize: "clamp(1.5rem, 4vw, 3.2rem)",
                      fontWeight: 800,
                      color: "#fff",
                      lineHeight: 1.1,
                      marginBottom: 12,
                      maxWidth: 600,
                      textShadow: "0 2px 20px rgba(0,0,0,0.7)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {title}
                  </h2>

                  {/* Meta row */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 20,
                    }}
                  >
                    {releaseYear && (
                      <span
                        style={{
                          color: "#8888a8",
                          fontSize: "0.88rem",
                          fontWeight: 500,
                        }}
                      >
                        {releaseYear}
                      </span>
                    )}
                    {typeof movie.vote_average === "number" &&
                      movie.vote_average > 0 && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            background: "rgba(245,197,24,0.15)",
                            border: "1px solid rgba(245,197,24,0.4)",
                            borderRadius: 8,
                            padding: "3px 10px",
                            fontSize: "0.82rem",
                            fontWeight: 700,
                            color: "#f5c518",
                          }}
                        >
                          <MdStar size={13} />
                          {(movie.vote_average as number).toFixed(1)}
                        </span>
                      )}
                    {genres.map((g) => (
                      <span
                        key={g}
                        style={{
                          padding: "3px 10px",
                          borderRadius: 99,
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          background: "rgba(255,255,255,0.08)",
                          color: "rgba(232,232,240,0.75)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        {g}
                      </span>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <button
                      onClick={() => handlePlay(movie)}
                      className="slider-btn-primary"
                    >
                      <FaPlay size={13} />
                      Play Now
                    </button>
                    <button
                      onClick={() => handlePlay(movie)}
                      className="slider-btn-secondary"
                    >
                      <FaInfoCircle size={14} />
                      More Info
                    </button>
                  </div>
                </div>

                {/* Slide indicator dots */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    right: "clamp(24px, 4vw, 56px)",
                    display: "flex",
                    gap: 6,
                  }}
                >
                  {sliderMovies.map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: i === activeIdx ? 24 : 6,
                        height: 6,
                        borderRadius: 99,
                        background:
                          i === activeIdx
                            ? "#f5c518"
                            : "rgba(255,255,255,0.25)",
                        transition: "all 0.4s",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </Slider>

      {/* CSS moved to a style tag to avoid inline JS hover handlers */}
      <style>{`
        .slider-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 28px;
          background: linear-gradient(135deg, #f5c518, #e8a800);
          color: #0a0a0f;
          border-radius: 99px;
          font-weight: 800;
          font-size: 0.9rem;
          letter-spacing: 0.01em;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 20px rgba(245,197,24,0.4);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .slider-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(245,197,24,0.55);
        }
        .slider-btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 24px;
          background: rgba(255,255,255,0.1);
          color: #e8e8f0;
          border-radius: 99px;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.18);
          transition: background 0.2s, transform 0.2s;
          backdrop-filter: blur(8px);
        }
        .slider-btn-secondary:hover {
          background: rgba(255,255,255,0.18);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
