"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getTvshowDetail,
  getTvshowEpisodes,
  RecommendedTvshows,
} from "@/lib/fetchMovies";
import MovieCard from "@/components/MovieCard";
import AddToFavBtn from "@/components/AddToFavBtn";
import {
  MdStar,
  MdExpandMore,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { FiMonitor } from "react-icons/fi";

type Tvshow = {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: string;
  original_language: string;
  status: string;
  vote_average: number;
  vote_count: number;
  genres?: any[];
  media_type: string;
};
type Episode = {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  season_number: number;
};

const TV_GENRE_API =
  "https://api.themoviedb.org/3/genre/tv/list?api_key=b6a27c41bfadea6397dcd72c3877cac1";

/* VidFast is FIRST = default */
const SERVERS = [
  {
    name: "VidFast",
    getUrl: (id: string, season: string, episode: string) =>
      `https://vidfast.pro/tv/${id}/${season}/${episode}?autoPlay=false`,
  },
  {
    name: "Videasy",
    getUrl: (id: string, season: string, episode: string) =>
      `https://player.videasy.net/tv/${id}/${season}/${episode}`,
  },
  {
    name: "VidLink",
    getUrl: (id: string, season: string, episode: string) =>
      `https://vidlink.pro/tv/${id}/${season}/${episode}`,
  },
  {
    name: "VidSrc",
    getUrl: (id: string, season: string, episode: string) =>
      `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}?autoPlay=false`,
  },
];

export default function EpisodePage() {
  const params = useParams() as {
    id: string;
    seasonNumber: string;
    episodeNumber: string;
  };
  const router = useRouter();
  const { id, seasonNumber, episodeNumber } = params;

  const [tvshow, setTvshow] = useState<Tvshow | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [recommendedTvshows, setRecommendedTvshows] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<number>(
    Number(seasonNumber),
  );
  const [seasonKeys, setSeasonKeys] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const episodesPerPage = 12;

  const [iframeLoading, setIframeLoading] = useState(true);
  const [posterLoading, setPosterLoading] = useState(true);
  const [episodeImageLoading, setEpisodeImageLoading] = useState<{
    [key: number]: boolean;
  }>({});
  const [tvGenres, setTvGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedServer, setSelectedServer] = useState(SERVERS[0].name);

  useEffect(() => {
    fetch(`${TV_GENRE_API}`)
      .then((r) => r.json())
      .then((data) => setTvGenres(data.genres || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    getTvshowDetail(Number(id)).then((data) => {
      setTvshow(data);
      if (data?.seasons) {
        setSeasonKeys(
          data.seasons
            .map((s: any) => s.season_number)
            .filter((n: number) => n > 0),
        );
      }
    });
  }, [id]);

  useEffect(() => {
    if (!id || !tvGenres.length) return;
    RecommendedTvshows(Number(id)).then((data) => {
      const mapped = (data || []).map((show: any) => ({
        ...show,
        genres: show.genre_ids
          ? show.genre_ids
              .map((gid: number) => tvGenres.find((g) => g.id === gid)?.name)
              .filter(Boolean)
          : [],
      }));
      setRecommendedTvshows(mapped);
    });
  }, [id, tvGenres]);

  useEffect(() => {
    if (!id || !selectedSeason) return;
    getTvshowEpisodes(Number(id), selectedSeason).then((data) => {
      setEpisodes(data?.episodes || []);
      setCurrentPage(1);
    });
  }, [id, selectedSeason]);

  const totalPages = Math.ceil(episodes.length / episodesPerPage);
  const startIndex = (currentPage - 1) * episodesPerPage;
  const currentEpisodes = episodes.slice(
    startIndex,
    startIndex + episodesPerPage,
  );

  if (!tvshow) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--clr-bg)",
          paddingTop: 80,
        }}
      >
        <div
          className="skeleton"
          style={{ width: 120, height: 120, borderRadius: "50%" }}
        />
      </div>
    );
  }

  const serverObj =
    SERVERS.find((s) => s.name === selectedServer) || SERVERS[0];
  const iframeUrl = serverObj.getUrl(id, seasonNumber, episodeNumber);

  return (
    <div
      style={{
        background: "var(--clr-bg)",
        minHeight: "100vh",
        paddingTop: 68,
        overflowX: "hidden",
      }}
    >
      <div
        style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 12px 60px" }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Top: Player + Info */}
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            {/* Player col */}
            <div style={{ flex: "2 1 420px", minWidth: 0 }}>
              {/* Server selector */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    color: "#8888a8",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <FiMonitor size={13} /> Server:
                </span>
                {SERVERS.map((server) => (
                  <button
                    key={server.name}
                    onClick={() => {
                      setIframeLoading(true);
                      setSelectedServer(server.name);
                    }}
                    style={{
                      padding: "6px 15px",
                      borderRadius: 8,
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      border: "1px solid",
                      borderColor:
                        selectedServer === server.name
                          ? "#f5c518"
                          : "rgba(255,255,255,0.1)",
                      background:
                        selectedServer === server.name
                          ? "#f5c518"
                          : "rgba(255,255,255,0.05)",
                      color:
                        selectedServer === server.name ? "#0a0a0f" : "#e8e8f0",
                      boxShadow:
                        selectedServer === server.name
                          ? "0 0 12px rgba(245,197,24,0.35)"
                          : "none",
                    }}
                  >
                    {server.name}
                  </button>
                ))}
              </div>

              {/* iframe */}
              <div
                style={{
                  position: "relative",
                  borderRadius: 14,
                  overflow: "hidden",
                  background: "#000",
                  boxShadow: "0 8px 48px rgba(0,0,0,0.8)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {iframeLoading && (
                  <div
                    className="skeleton"
                    style={{
                      width: "100%",
                      paddingTop: "56.25%",
                      borderRadius: 0,
                    }}
                  />
                )}
                <iframe
                  key={iframeUrl}
                  src={iframeUrl}
                  style={{
                    width: "100%",
                    aspectRatio: "16/9",
                    display: "block",
                    border: "none",
                    opacity: iframeLoading ? 0 : 1,
                    transition: "opacity 0.4s",
                    position: iframeLoading ? "absolute" : "relative",
                    top: 0,
                    left: 0,
                  }}
                  allowFullScreen
                  allow="autoplay; fullscreen; picture-in-picture"
                  onLoad={() => setIframeLoading(false)}
                />
              </div>

              <p
                style={{
                  marginTop: 8,
                  fontSize: "0.74rem",
                  color: "#8888a8",
                  textAlign: "center",
                }}
              >
                If the player fails, switch server above.
              </p>

              {/* Prev / Next episode */}
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button
                  onClick={() => {
                    if (Number(episodeNumber) > 1) {
                      router.push(
                        `/tv/${tvshow.id}/${tvshow.name}/season/${selectedSeason}/episode/${Number(episodeNumber) - 1}`,
                      );
                    } else if (selectedSeason > Math.min(...seasonKeys)) {
                      const prev = selectedSeason - 1;
                      const prevEps = episodes.filter(
                        (ep) => ep.season_number === prev,
                      );
                      const last =
                        prevEps[prevEps.length - 1]?.episode_number || 1;
                      router.push(
                        `/tv/${tvshow.id}/${tvshow.name}/season/${prev}/episode/${last}`,
                      );
                    }
                  }}
                  disabled={
                    Number(episodeNumber) === 1 &&
                    selectedSeason === Math.min(...seasonKeys)
                  }
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.1)",
                    background:
                      Number(episodeNumber) === 1 &&
                      selectedSeason === Math.min(...seasonKeys)
                        ? "rgba(255,255,255,0.03)"
                        : "var(--clr-surface2)",
                    color:
                      Number(episodeNumber) === 1 &&
                      selectedSeason === Math.min(...seasonKeys)
                        ? "#8888a8"
                        : "#e8e8f0",
                    cursor:
                      Number(episodeNumber) === 1 &&
                      selectedSeason === Math.min(...seasonKeys)
                        ? "not-allowed"
                        : "pointer",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <MdChevronLeft size={18} /> Previous
                </button>
                <button
                  onClick={() => {
                    if (
                      Number(episodeNumber) <
                      (episodes[episodes.length - 1]?.episode_number || 0)
                    ) {
                      router.push(
                        `/tv/${tvshow.id}/${tvshow.name}/season/${selectedSeason}/episode/${Number(episodeNumber) + 1}`,
                      );
                    } else if (selectedSeason < Math.max(...seasonKeys)) {
                      router.push(
                        `/tv/${tvshow.id}/${tvshow.name}/season/${selectedSeason + 1}/episode/1`,
                      );
                    }
                  }}
                  disabled={
                    Number(episodeNumber) ===
                      episodes[episodes.length - 1]?.episode_number &&
                    selectedSeason === Math.max(...seasonKeys)
                  }
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 10,
                    border: "1px solid",
                    borderColor:
                      Number(episodeNumber) ===
                        episodes[episodes.length - 1]?.episode_number &&
                      selectedSeason === Math.max(...seasonKeys)
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(245,197,24,0.35)",
                    background:
                      Number(episodeNumber) ===
                        episodes[episodes.length - 1]?.episode_number &&
                      selectedSeason === Math.max(...seasonKeys)
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(245,197,24,0.12)",
                    color:
                      Number(episodeNumber) ===
                        episodes[episodes.length - 1]?.episode_number &&
                      selectedSeason === Math.max(...seasonKeys)
                        ? "#8888a8"
                        : "#f5c518",
                    cursor:
                      Number(episodeNumber) ===
                        episodes[episodes.length - 1]?.episode_number &&
                      selectedSeason === Math.max(...seasonKeys)
                        ? "not-allowed"
                        : "pointer",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  Next <MdChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Info col */}
            <div style={{ flex: "1 1 220px", minWidth: 220 }}>
              <div style={{ display: "flex", gap: 14 }}>
                {/* Poster */}
                <div
                  style={{
                    width: 100,
                    flexShrink: 0,
                    borderRadius: 10,
                    overflow: "hidden",
                    boxShadow: "0 6px 28px rgba(0,0,0,0.6)",
                    border: "2px solid rgba(255,255,255,0.08)",
                    position: "relative",
                  }}
                >
                  {posterLoading && (
                    <div
                      className="skeleton"
                      style={{
                        width: "100%",
                        paddingTop: "150%",
                        borderRadius: 0,
                      }}
                    />
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://image.tmdb.org/t/p/w185${tvshow.poster_path}`}
                    alt={tvshow.name}
                    style={{
                      width: "100%",
                      height: "auto",
                      display: "block",
                      opacity: posterLoading ? 0 : 1,
                      transition: "opacity 0.4s",
                      position: posterLoading ? "absolute" : "relative",
                    }}
                    onLoad={() => setPosterLoading(false)}
                  />
                  <div style={{ position: "absolute", top: 4, right: 4 }}>
                    <AddToFavBtn movie={{ ...tvshow, media_type: "tv" }} />
                  </div>
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h1
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 800,
                      color: "#fff",
                      lineHeight: 1.25,
                      marginBottom: 6,
                    }}
                  >
                    {tvshow.name}
                  </h1>
                  <span
                    style={{
                      display: "inline-block",
                      background: "rgba(245,197,24,0.9)",
                      color: "#0a0a0f",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      padding: "3px 10px",
                      borderRadius: 6,
                      letterSpacing: "0.04em",
                      marginBottom: 10,
                    }}
                  >
                    S{seasonNumber}·E{episodeNumber}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 5,
                      color: "rgba(232,232,240,0.7)",
                      fontSize: "0.82rem",
                    }}
                  >
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ color: "#8888a8", minWidth: 70 }}>
                        Release:
                      </span>
                      <span>
                        {new Date(tvshow.first_air_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ color: "#8888a8", minWidth: 70 }}>
                        Language:
                      </span>
                      <span>{tvshow.original_language?.toUpperCase()}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ color: "#8888a8", minWidth: 70 }}>
                        Status:
                      </span>
                      <span
                        style={{
                          color:
                            tvshow.status === "Returning Series"
                              ? "#4ade80"
                              : "#e8e8f0",
                        }}
                      >
                        {tvshow.status}
                      </span>
                    </div>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <span style={{ color: "#8888a8", minWidth: 70 }}>
                        Rating:
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                          color: "#f5c518",
                          fontWeight: 700,
                        }}
                      >
                        <MdStar size={13} />
                        {tvshow.vote_average.toFixed(1)}
                        <span
                          style={{
                            color: "#8888a8",
                            fontWeight: 400,
                            fontSize: "0.75rem",
                          }}
                        >
                          ({tvshow.vote_count?.toLocaleString()})
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Genres */}
                  {tvshow.genres && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 5,
                        marginTop: 10,
                      }}
                    >
                      {tvshow.genres.map((g: any) => (
                        <span
                          key={g.id || g}
                          style={{
                            padding: "3px 10px",
                            borderRadius: 99,
                            fontSize: "0.68rem",
                            fontWeight: 600,
                            background: "rgba(255,255,255,0.07)",
                            color: "rgba(232,232,240,0.7)",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}
                        >
                          {g.name || g}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Episode description */}
              {episodes.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <h3
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "#f5c518",
                      marginBottom: 6,
                    }}
                  >
                    Episode Description
                  </h3>
                  <p
                    style={{
                      color: "rgba(232,232,240,0.65)",
                      fontSize: "0.82rem",
                      lineHeight: 1.65,
                    }}
                  >
                    {episodes.find(
                      (ep) =>
                        ep.episode_number === Number(episodeNumber) &&
                        ep.season_number === selectedSeason,
                    )?.overview || "No description available."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Season dropdown + episodes */}
          <div style={{ marginTop: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 16,
                flexWrap: "wrap",
              }}
            >
              <h2
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#fff",
                  margin: 0,
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
                    padding: "7px 14px",
                    background: "var(--clr-surface2)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    color: "#e8e8f0",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Season {selectedSeason}
                  <MdExpandMore
                    size={17}
                    style={{
                      transform: isDropdownOpen ? "rotate(180deg)" : "none",
                      transition: "0.2s",
                    }}
                  />
                </button>
                {isDropdownOpen && (
                  <div
                    className="scrollbar"
                    style={{
                      position: "absolute",
                      top: "calc(100% + 5px)",
                      left: 0,
                      minWidth: "100%",
                      maxHeight: 200,
                      overflowY: "auto",
                      background: "rgba(18,18,26,0.99)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10,
                      boxShadow: "0 12px 32px rgba(0,0,0,0.5)",
                      zIndex: 50,
                    }}
                  >
                    {seasonKeys.map((season) => (
                      <button
                        key={season}
                        onClick={() => {
                          setSelectedSeason(season);
                          setIsDropdownOpen(false);
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          padding: "9px 16px",
                          textAlign: "left",
                          background:
                            season === selectedSeason
                              ? "rgba(245,197,24,0.1)"
                              : "transparent",
                          color:
                            season === selectedSeason ? "#f5c518" : "#e8e8f0",
                          fontSize: "0.85rem",
                          cursor: "pointer",
                          border: "none",
                          fontWeight: season === selectedSeason ? 700 : 400,
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        Season {season}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span style={{ color: "#8888a8", fontSize: "0.78rem" }}>
                {episodes.length} episodes
              </span>
            </div>

            {/* Episode grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: 12,
              }}
            >
              {currentEpisodes.map((episode) => (
                <Link
                  key={episode.episode_number}
                  href={`/tv/${tvshow.id}/${tvshow.name.replace("%", "-")}/season/${selectedSeason}/episode/${episode.episode_number}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      borderRadius: 10,
                      overflow: "hidden",
                      background: "var(--clr-surface)",
                      border:
                        episode.episode_number === Number(episodeNumber) &&
                        selectedSeason === Number(seasonNumber)
                          ? "2px solid #f5c518"
                          : "1px solid rgba(255,255,255,0.06)",
                      boxShadow: "var(--shadow-card)",
                      transition: "all 0.25s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "translateY(-4px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "0 10px 30px rgba(0,0,0,0.7)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "translateY(0)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "var(--shadow-card)";
                    }}
                  >
                    {/* Thumb */}
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        aspectRatio: "16/9",
                        background: "var(--clr-surface2)",
                      }}
                    >
                      {!episodeImageLoading[episode.episode_number] && (
                        <div
                          className="skeleton"
                          style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: 0,
                          }}
                        />
                      )}
                      <img
                        src={
                          episode.still_path
                            ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
                            : `https://image.tmdb.org/t/p/w342${tvshow.poster_path}`
                        }
                        alt={episode.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          opacity: episodeImageLoading[episode.episode_number]
                            ? 1
                            : 0,
                          transition: "opacity 0.3s",
                          display: "block",
                        }}
                        onLoad={() =>
                          setEpisodeImageLoading((p) => ({
                            ...p,
                            [episode.episode_number]: true,
                          }))
                        }
                      />
                      <span
                        style={{
                          position: "absolute",
                          bottom: 4,
                          left: 4,
                          background: "rgba(245,197,24,0.9)",
                          color: "#0a0a0f",
                          fontSize: "0.63rem",
                          fontWeight: 800,
                          padding: "2px 6px",
                          borderRadius: 4,
                        }}
                      >
                        E{episode.episode_number}
                      </span>
                    </div>
                    <div style={{ padding: "7px 9px" }}>
                      <p
                        style={{
                          fontSize: "0.77rem",
                          fontWeight: 600,
                          color: "#e8e8f0",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {episode.name}
                      </p>
                      <p
                        style={{
                          fontSize: "0.67rem",
                          color: "#8888a8",
                          marginTop: 2,
                        }}
                      >
                        S{selectedSeason} E{episode.episode_number}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 20,
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
                    border: "1px solid rgba(255,255,255,0.1)",
                    background:
                      currentPage === 1
                        ? "rgba(255,255,255,0.03)"
                        : "var(--clr-surface2)",
                    color: currentPage === 1 ? "#8888a8" : "#e8e8f0",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                    fontSize: "0.83rem",
                    fontWeight: 600,
                  }}
                >
                  <MdChevronLeft size={16} /> Prev
                </button>
                <span style={{ color: "#8888a8", fontSize: "0.8rem" }}>
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
                    border: "1px solid rgba(255,255,255,0.1)",
                    background:
                      currentPage === totalPages
                        ? "rgba(255,255,255,0.03)"
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

          {/* Recommended */}
          {recommendedTvshows.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div className="divider" />
              <h2
                className="section-heading"
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: 16,
                }}
              >
                Recommended Shows
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                  gap: 12,
                }}
              >
                {recommendedTvshows.map((show) => (
                  <MovieCard
                    key={show.id}
                    movie={{ ...show, media_type: "tv" }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
