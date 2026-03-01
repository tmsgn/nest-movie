"use client";
import Slider from "react-slick";
import { FaPlay, FaInfoCircle } from "react-icons/fa";
import { MdStar } from "react-icons/md";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

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
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5500,
    arrows: false,
    pauseOnHover: true,
    beforeChange: (_: number, next: number) => setActiveIdx(next),
  };

  return (
    <div style={{ position: "relative", width: "100%", marginBottom: 40 }}>
      <Slider {...settings}>
        {movies.map((movie, idx) => {
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
                {/* Backdrop */}
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    filter: "brightness(0.55) saturate(1.1)",
                    transition: "transform 8s ease",
                    transform: idx === activeIdx ? "scale(1.03)" : "scale(1)",
                  }}
                />

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
                        letterSpacing: "0.01em",
                        cursor: "pointer",
                        border: "none",
                        boxShadow: "0 4px 20px rgba(245,197,24,0.4)",
                        transition: "all 0.25s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform =
                          "translateY(-2px)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          "0 8px 28px rgba(245,197,24,0.55)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform =
                          "translateY(0)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          "0 4px 20px rgba(245,197,24,0.4)";
                      }}
                    >
                      <FaPlay size={13} />
                      Play Now
                    </button>
                    <button
                      onClick={() => handlePlay(movie)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "11px 24px",
                        background: "rgba(255,255,255,0.1)",
                        color: "#e8e8f0",
                        borderRadius: 99,
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        cursor: "pointer",
                        border: "1px solid rgba(255,255,255,0.18)",
                        transition: "all 0.25s",
                        backdropFilter: "blur(8px)",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(255,255,255,0.18)";
                        (e.currentTarget as HTMLButtonElement).style.transform =
                          "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.background = "rgba(255,255,255,0.10)";
                        (e.currentTarget as HTMLButtonElement).style.transform =
                          "translateY(0)";
                      }}
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
                  {movies.map((_, i) => (
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
    </div>
  );
}
