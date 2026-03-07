"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MdStar,
  MdExpandMore,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { FiPlay } from "react-icons/fi";
import { FaYoutube } from "react-icons/fa";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY!;

type Episode = {
  season_number: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string;
};
type CastMember = { name: string; character: string; profile_path: string };

export default function TVPageContent({
  tvshow,
  tvshowDetail,
  episodesBySeason: initialEpisodes,
  cast,
  trailer,
}: {
  tvshow: any;
  tvshowDetail: any;
  episodesBySeason: { [sn: number]: Episode[] };
  cast: CastMember[];
  trailer: any;
}) {
  const router = useRouter();
  const seasons: number[] = (tvshowDetail.seasons || [])
    .map((s: any) => s.season_number)
    .filter((n: number) => n > 0);

  const [episodesBySeason, setEpisodesBySeason] = useState<{
    [sn: number]: Episode[];
  }>(initialEpisodes);
  const [selectedSeason, setSelectedSeason] = useState(seasons[0] || 1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loadingSeason, setLoadingSeason] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const episodesPerPage = 12;

  const fetchSeason = useCallback(
    async (season: number) => {
      if (episodesBySeason[season]) return;
      setLoadingSeason(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${tvshow.id}/season/${season}?api_key=${API_KEY}`,
        );
        const data = await res.json();
        setEpisodesBySeason((prev) => ({
          ...prev,
          [season]: (data.episodes || []).map((e: any) => ({
            season_number: e.season_number,
            episode_number: e.episode_number,
            name: e.name,
            overview: e.overview,
            still_path: e.still_path,
          })),
        }));
      } catch {
        /* ignore */
      }
      setLoadingSeason(false);
    },
    [episodesBySeason, tvshow.id],
  );

  const handleSeasonSelect = async (season: number) => {
    setSelectedSeason(season);
    setCurrentPage(1);
    setIsDropdownOpen(false);
    await fetchSeason(season);
  };

  // Navigate to the full episode page
  const goToEpisode = (season: number, epNum: number) => {
    const slug = encodeURIComponent(tvshow.name);
    router.push(`/tv/${tvshow.id}/${slug}/season/${season}/episode/${epNum}`);
  };

  const episodes = episodesBySeason[selectedSeason] || [];
  const totalPages = Math.ceil(episodes.length / episodesPerPage);
  const currentEpisodes = episodes.slice(
    (currentPage - 1) * episodesPerPage,
    currentPage * episodesPerPage,
  );

  const year = tvshow.first_air_date
    ? new Date(tvshow.first_air_date).getFullYear()
    : "—";

  return (
    <div
      style={{
        background: "var(--clr-bg)",
        minHeight: "100vh",
        paddingTop: 68,
      }}
    >
      {/* ── Hero backdrop ── */}
      {tvshow.backdrop_path && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "clamp(180px, 38vh, 380px)",
            overflow: "hidden",
            background: "#0a0a0f",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://image.tmdb.org/t/p/w1280${tvshow.backdrop_path}`}
            alt={tvshow.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
              filter: "brightness(0.38) saturate(1.1)",
            }}
            loading="eager"
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top,rgba(10,10,20,1) 0%,rgba(10,10,20,0.5) 60%,transparent 100%)",
            }}
          />
        </div>
      )}

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px 60px" }}>
        {/* ── Show info ── */}
        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: -90,
            position: "relative",
            zIndex: 10,
            flexWrap: "wrap",
            alignItems: "flex-start",
          }}
        >
          {/* Poster */}
          {tvshow.poster_path && (
            <div
              style={{
                width: "clamp(110px,14vw,190px)",
                flexShrink: 0,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 8px 32px rgba(0,0,0,.7)",
                border: "2px solid rgba(255,255,255,.09)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://image.tmdb.org/t/p/w342${tvshow.poster_path}`}
                alt={tvshow.name}
                style={{ width: "100%", height: "auto", display: "block" }}
                loading="eager"
              />
            </div>
          )}

          {/* Info */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 10px",
                borderRadius: 99,
                fontSize: "0.7rem",
                fontWeight: 700,
                background: "rgba(96,165,250,0.15)",
                border: "1px solid rgba(96,165,250,0.3)",
                color: "#60a5fa",
                marginBottom: 8,
              }}
            >
              TV SHOW
            </span>
            <h1
              style={{
                fontSize: "clamp(1.4rem,3.5vw,2.4rem)",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.02em",
                lineHeight: 1.15,
                marginBottom: 10,
              }}
            >
              {tvshow.name}
            </h1>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: "rgba(245,197,24,.15)",
                  border: "1px solid rgba(245,197,24,.4)",
                  borderRadius: 8,
                  padding: "3px 10px",
                  fontSize: "0.83rem",
                  fontWeight: 700,
                  color: "#f5c518",
                }}
              >
                <MdStar size={13} />
                {tvshow.vote_average?.toFixed(1)}
              </span>
              <span style={{ color: "#8888a8", fontSize: "0.85rem" }}>
                {year}
              </span>
              {tvshowDetail.number_of_seasons && (
                <span style={{ color: "#8888a8", fontSize: "0.85rem" }}>
                  {tvshowDetail.number_of_seasons} Season
                  {tvshowDetail.number_of_seasons > 1 ? "s" : ""}
                </span>
              )}
              <span
                style={{
                  background: "linear-gradient(135deg,#f5c518,#e8a800)",
                  color: "#0a0a0f",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  padding: "3px 8px",
                  borderRadius: 5,
                }}
              >
                HD
              </span>
            </div>
            {tvshowDetail.genres?.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 7,
                  marginBottom: 14,
                }}
              >
                {tvshowDetail.genres.map((g: any) => (
                  <span
                    key={g.id}
                    style={{
                      padding: "4px 12px",
                      borderRadius: 99,
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      background: "rgba(255,255,255,.07)",
                      color: "rgba(232,232,240,.75)",
                      border: "1px solid rgba(255,255,255,.1)",
                    }}
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}
            <p
              style={{
                color: "rgba(232,232,240,.7)",
                lineHeight: 1.7,
                fontSize: "0.9rem",
                maxWidth: 680,
                marginBottom: 18,
              }}
            >
              {tvshow.overview}
            </p>
            {/* Watch S1E1 button — navigates to episode page */}
            <button
              onClick={() => goToEpisode(seasons[0] || 1, 1)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "11px 28px",
                background: "linear-gradient(135deg,#f5c518,#e8a800)",
                color: "#0a0a0f",
                borderRadius: 99,
                fontWeight: 800,
                fontSize: "0.9rem",
                cursor: "pointer",
                border: "none",
                boxShadow: "0 4px 20px rgba(245,197,24,.4)",
              }}
            >
              <FiPlay size={14} /> Watch S1·E1
            </button>
          </div>

          {/* Trailer */}
          {trailer && (
            <div style={{ width: "clamp(200px,28vw,360px)", flexShrink: 0 }}>
              <h2
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "#f5c518",
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <FaYoutube size={16} /> Trailer
              </h2>
              <div
                style={{
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 6px 28px rgba(0,0,0,.6)",
                  border: "1px solid rgba(255,255,255,.07)",
                }}
              >
                <iframe
                  width="100%"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="Trailer"
                  style={{
                    aspectRatio: "16/9",
                    display: "block",
                    border: "none",
                  }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>

        {/* ── Cast ── */}
        {cast.length > 0 && (
          <div style={{ marginTop: 44 }}>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#fff",
                marginBottom: 18,
                borderLeft: "3px solid #f5c518",
                paddingLeft: 10,
              }}
            >
              Cast
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(88px,1fr))",
                gap: 14,
              }}
            >
              {cast.map((member, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: "50%",
                      overflow: "hidden",
                      background: "var(--clr-surface2)",
                      border: "2px solid rgba(255,255,255,.08)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        member.profile_path
                          ? `https://image.tmdb.org/t/p/w185${member.profile_path}`
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=1a1a26&color=8888a8&size=68`
                      }
                      alt={member.name}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        fontSize: "0.73rem",
                        fontWeight: 600,
                        color: "#e8e8f0",
                        lineHeight: 1.2,
                      }}
                    >
                      {member.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.65rem",
                        color: "#8888a8",
                        marginTop: 1,
                      }}
                    >
                      {member.character}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Episodes ── */}
        <div style={{ marginTop: 48 }}>
          <div
            style={{
              width: "100%",
              height: 1,
              background: "rgba(255,255,255,0.06)",
              marginBottom: 28,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 700,
                color: "#fff",
                margin: 0,
                borderLeft: "3px solid #f5c518",
                paddingLeft: 10,
              }}
            >
              Episodes
            </h2>
            {/* Season dropdown */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  background: "var(--clr-surface2)",
                  border: "1px solid rgba(255,255,255,.1)",
                  borderRadius: 8,
                  color: "#e8e8f0",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Season {selectedSeason}
                <MdExpandMore
                  size={18}
                  style={{
                    transform: isDropdownOpen ? "rotate(180deg)" : "none",
                    transition: ".2s",
                  }}
                />
              </button>
              {isDropdownOpen && (
                <div
                  className="scrollbar"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 6px)",
                    left: 0,
                    minWidth: "100%",
                    maxHeight: 200,
                    overflowY: "auto",
                    background: "rgba(18,18,26,.98)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,.1)",
                    borderRadius: 10,
                    boxShadow: "0 12px 32px rgba(0,0,0,.5)",
                    zIndex: 50,
                  }}
                >
                  {seasons.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSeasonSelect(s)}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "9px 16px",
                        textAlign: "left",
                        background:
                          s === selectedSeason
                            ? "rgba(245,197,24,.1)"
                            : "transparent",
                        color: s === selectedSeason ? "#f5c518" : "#e8e8f0",
                        fontSize: "0.88rem",
                        cursor: "pointer",
                        border: "none",
                        fontWeight: s === selectedSeason ? 700 : 400,
                        borderBottom: "1px solid rgba(255,255,255,.04)",
                      }}
                    >
                      Season {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span style={{ color: "#8888a8", fontSize: "0.8rem" }}>
              {loadingSeason ? "Loading…" : `${episodes.length} episodes`}
            </span>
          </div>

          {/* Episode grid */}
          {loadingSeason ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
                gap: 14,
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ borderRadius: 10, overflow: "hidden" }}>
                  <div
                    className="skeleton"
                    style={{
                      width: "100%",
                      aspectRatio: "16/9",
                      borderRadius: 0,
                    }}
                  />
                  <div
                    style={{
                      padding: "8px 10px",
                      background: "var(--clr-surface)",
                      display: "flex",
                      flexDirection: "column",
                      gap: 5,
                    }}
                  >
                    <div
                      className="skeleton"
                      style={{ width: "85%", height: 11, borderRadius: 4 }}
                    />
                    <div
                      className="skeleton"
                      style={{ width: "50%", height: 9, borderRadius: 4 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))",
                gap: 14,
              }}
            >
              {currentEpisodes.map((ep) => (
                <button
                  key={ep.episode_number}
                  onClick={() => goToEpisode(selectedSeason, ep.episode_number)}
                  style={{
                    background: "var(--clr-surface)",
                    borderRadius: 10,
                    overflow: "hidden",
                    cursor: "pointer",
                    border: "1px solid rgba(255,255,255,.06)",
                    transition: "all .25s",
                    textAlign: "left",
                    padding: 0,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "translateY(-4px)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(245,197,24,.35)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(255,255,255,.06)";
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: "16/9",
                      background: "var(--clr-surface2)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        ep.still_path
                          ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
                          : `https://image.tmdb.org/t/p/w342${tvshow.poster_path}`
                      }
                      alt={ep.name}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                    {/* Episode number badge */}
                    <span
                      style={{
                        position: "absolute",
                        bottom: 6,
                        left: 6,
                        background: "rgba(245,197,24,.9)",
                        color: "#0a0a0f",
                        fontSize: "0.63rem",
                        fontWeight: 800,
                        padding: "2px 7px",
                        borderRadius: 5,
                      }}
                    >
                      E{ep.episode_number}
                    </span>
                    {/* Play overlay on hover */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background .2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.background =
                          "rgba(0,0,0,0.45)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.background =
                          "rgba(0,0,0,0)";
                      }}
                    ></div>
                  </div>
                  <div style={{ padding: "8px 10px" }}>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        color: "#e8e8f0",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ep.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.7rem",
                        color: "#8888a8",
                        marginTop: 2,
                      }}
                    >
                      S{selectedSeason} E{ep.episode_number}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loadingSeason && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 12,
                marginTop: 24,
              }}
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "8px 18px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,.1)",
                  background:
                    currentPage === 1
                      ? "rgba(255,255,255,.03)"
                      : "var(--clr-surface2)",
                  color: currentPage === 1 ? "#8888a8" : "#e8e8f0",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontSize: "0.83rem",
                  fontWeight: 600,
                }}
              >
                <MdChevronLeft size={16} /> Prev
              </button>
              <span style={{ color: "#8888a8", fontSize: "0.82rem" }}>
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "8px 18px",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,.1)",
                  background:
                    currentPage === totalPages
                      ? "rgba(255,255,255,.03)"
                      : "var(--clr-surface2)",
                  color: currentPage === totalPages ? "#8888a8" : "#e8e8f0",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                  fontSize: "0.83rem",
                  fontWeight: 600,
                }}
              >
                Next <MdChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
