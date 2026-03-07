"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import MovieCard from "./MovieCard";
import {
  MdMovie,
  MdTv,
  MdFilterList,
  MdClose,
  MdCheck,
  MdExpandMore,
} from "react-icons/md";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY!;
const BASE = "https://api.themoviedb.org/3";

type Genre = { id: number; name: string };
type MediaItem = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids: number[];
  media_type: string;
};

const MOVIE_SORTS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Top Rated" },
  { value: "primary_release_date.desc", label: "Newest First" },
  { value: "primary_release_date.asc", label: "Oldest First" },
  { value: "revenue.desc", label: "Highest Grossing" },
];
const TV_SORTS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Top Rated" },
  { value: "first_air_date.desc", label: "Newest First" },
  { value: "first_air_date.asc", label: "Oldest First" },
];
const RATINGS = [
  { value: "", label: "Any Rating" },
  { value: "8", label: "8+ Stars" },
  { value: "7", label: "7+ Stars" },
  { value: "6", label: "6+ Stars" },
  { value: "5", label: "5+ Stars" },
];
const NOW = new Date().getFullYear();
const YEARS = Array.from({ length: NOW - 1969 }, (_, i) => String(NOW - i));

function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: 10,
        overflow: "hidden",
        background: "var(--clr-surface)",
      }}
    >
      <div className="skeleton" style={{ width: "100%", aspectRatio: "2/3" }} />
      <div
        style={{
          padding: "8px 10px",
          background: "var(--clr-surface)",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div
          className="skeleton"
          style={{ width: "40%", height: 10, borderRadius: 4 }}
        />
        <div
          className="skeleton"
          style={{ width: "90%", height: 13, borderRadius: 4 }}
        />
        <div
          className="skeleton"
          style={{ width: "60%", height: 10, borderRadius: 4 }}
        />
      </div>
    </div>
  );
}

// ── Custom Dropdown ──────────────────────────────────────────────────────────
function Dropdown({
  value,
  onChange,
  options,
  accent = "#f5c518",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  accent?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", userSelect: "none" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 12px",
          background: open ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.07)",
          border: `1px solid ${open ? accent : "rgba(255,255,255,0.12)"}`,
          borderRadius: 8,
          color: value ? accent : "#e8e8f0",
          fontSize: "0.82rem",
          fontWeight: value ? 600 : 400,
          cursor: "pointer",
          transition: "all 0.15s",
          whiteSpace: "nowrap",
          fontFamily: "inherit",
        }}
      >
        {current?.label ?? "Select"}
        <MdExpandMore
          size={15}
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "0.2s",
            opacity: 0.7,
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            minWidth: "100%",
            maxHeight: 240,
            overflowY: "auto",
            background: "rgba(14,14,22,0.99)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
            zIndex: 200,
            scrollbarWidth: "thin",
          }}
        >
          {options.map((opt, i) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "9px 14px",
                  background: active ? `${accent}18` : "transparent",
                  color: active ? accent : "rgba(232,232,240,0.85)",
                  fontSize: "0.82rem",
                  fontWeight: active ? 700 : 400,
                  cursor: "pointer",
                  border: "none",
                  borderBottom:
                    i < options.length - 1
                      ? "1px solid rgba(255,255,255,0.04)"
                      : "none",
                  textAlign: "left",
                  fontFamily: "inherit",
                  transition: "background 0.1s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  if (!active)
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                }}
              >
                <span>{opt.label}</span>
                {active && <MdCheck size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
export default function DiscoverContent({ type }: { type: "movie" | "tv" }) {
  const isMovie = type === "movie";
  const sorts = isMovie ? MOVIE_SORTS : TV_SORTS;

  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [year, setYear] = useState("");
  const [minRating, setMinRating] = useState("");

  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const reqId = useRef(0);
  // Keep latest filter values accessible from page-change effect
  const filterSnap = useRef({ sortBy, selectedGenres, year, minRating });
  filterSnap.current = { sortBy, selectedGenres, year, minRating };

  // Load genres
  useEffect(() => {
    const path = isMovie ? "/genre/movie/list" : "/genre/tv/list";
    fetch(`${BASE}${path}?api_key=${API_KEY}`)
      .then((r) => r.json())
      .then((d) => setGenres(d.genres || []));
  }, [isMovie]);

  const doFetch = useCallback(
    async (
      pageNum: number,
      f: {
        sortBy: string;
        selectedGenres: number[];
        year: string;
        minRating: string;
      },
      replace: boolean,
    ) => {
      const id = ++reqId.current;
      setLoading(true);
      try {
        const p = new URLSearchParams({
          api_key: API_KEY,
          page: String(pageNum),
          sort_by: f.sortBy,
          include_adult: "false",
          "vote_count.gte": "30",
        });
        if (f.selectedGenres.length)
          p.set("with_genres", f.selectedGenres.join(","));
        if (f.year)
          p.set(
            isMovie ? "primary_release_year" : "first_air_date_year",
            f.year,
          );
        if (f.minRating) p.set("vote_average.gte", f.minRating);

        const endpoint = isMovie ? "movie" : "tv";
        const res = await fetch(`${BASE}/discover/${endpoint}?${p}`);
        const data = await res.json();
        if (id !== reqId.current) return;

        const results: MediaItem[] = (data.results || []).map((m: any) => ({
          id: m.id,
          title: isMovie ? (m.title ?? "Unknown") : (m.name ?? "Unknown"),
          name: isMovie ? m.title : m.name,
          poster_path: m.poster_path ?? null,
          release_date: m.release_date ?? m.first_air_date ?? "",
          first_air_date: m.first_air_date ?? "",
          vote_average: m.vote_average,
          genre_ids: m.genre_ids ?? [],
          media_type: type,
        }));

        setTotal(data.total_results || 0);
        setHasMore(pageNum < Math.min(data.total_pages || 1, 500));
        if (replace) setItems(results);
        else setItems((prev) => [...prev, ...results]);
      } catch {
        // ignore
      } finally {
        if (id === reqId.current) setLoading(false);
      }
    },
    [isMovie, type],
  );

  // Filter change → reset
  const genreKey = selectedGenres.slice().sort().join(",");
  useEffect(() => {
    const f = filterSnap.current;
    setPage(1);
    setHasMore(true);
    setItems([]);
    doFetch(1, f, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, genreKey, year, minRating, doFetch]);

  // Page increment → load more
  useEffect(() => {
    if (page > 1) doFetch(page, filterSnap.current, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, doFetch]);

  // Infinite scroll observer
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && hasMore && !loading) setPage((p) => p + 1);
      },
      { rootMargin: "400px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loading]);

  const toggleGenre = (id: number) =>
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );

  const clearAll = () => {
    setSelectedGenres([]);
    setYear("");
    setMinRating("");
    setSortBy("popularity.desc");
  };

  const hasFilters =
    selectedGenres.length > 0 ||
    !!year ||
    !!minRating ||
    sortBy !== "popularity.desc";

  return (
    <div
      style={{
        background: "var(--clr-bg)",
        minHeight: "100vh",
        paddingTop: 68,
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "32px clamp(16px,4vw,48px) 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              background: isMovie
                ? "linear-gradient(135deg,#f5c518,#e8a800)"
                : "linear-gradient(135deg,#60a5fa,#3b82f6)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {isMovie ? (
              <MdMovie size={22} color="#0a0a0f" />
            ) : (
              <MdTv size={22} color="#fff" />
            )}
          </div>
          <h1
            style={{
              fontSize: "clamp(1.4rem,3vw,2.2rem)",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            {isMovie ? "Explore Movies" : "Explore TV Shows"}
          </h1>
        </div>
        <p style={{ color: "#8888a8", fontSize: "0.85rem", marginBottom: 0 }}>
          {total > 0
            ? `${total.toLocaleString()} ${isMovie ? "movies" : "shows"} found`
            : "Browse and discover…"}
        </p>
      </div>

      {/* ── Sticky Filter Bar ── */}
      <div
        style={{
          position: "sticky",
          top: 57,
          zIndex: 50,
          background: "rgba(10,10,20,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "12px clamp(16px,4vw,48px)",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          {/* Controls row */}
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: "#8888a8",
                fontSize: "0.78rem",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              <MdFilterList size={15} /> Filters
            </span>

            <Dropdown
              value={sortBy}
              onChange={setSortBy}
              options={sorts}
              accent={isMovie ? "#f5c518" : "#60a5fa"}
            />

            <Dropdown
              value={year}
              onChange={setYear}
              options={[
                { value: "", label: "Any Year" },
                ...YEARS.map((y) => ({ value: y, label: y })),
              ]}
              accent={isMovie ? "#f5c518" : "#60a5fa"}
            />

            <Dropdown
              value={minRating}
              onChange={setMinRating}
              options={RATINGS}
              accent={isMovie ? "#f5c518" : "#60a5fa"}
            />

            {hasFilters && (
              <button
                onClick={clearAll}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "7px 14px",
                  background: "rgba(255,77,109,0.12)",
                  border: "1px solid rgba(255,77,109,0.3)",
                  borderRadius: 8,
                  color: "#ff6b87",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <MdClose size={13} /> Clear
              </button>
            )}
          </div>

          {/* Genre pills */}
          <div
            style={{
              display: "flex",
              gap: 7,
              overflowX: "auto",
              paddingBottom: 2,
              scrollbarWidth: "none",
            }}
          >
            {genres.map((g) => {
              const active = selectedGenres.includes(g.id);
              return (
                <button
                  key={g.id}
                  onClick={() => toggleGenre(g.id)}
                  style={{
                    flexShrink: 0,
                    padding: "4px 13px",
                    borderRadius: 99,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    border: `1px solid ${active ? (isMovie ? "#f5c518" : "#60a5fa") : "rgba(255,255,255,0.11)"}`,
                    background: active
                      ? isMovie
                        ? "rgba(245,197,24,0.14)"
                        : "rgba(96,165,250,0.14)"
                      : "rgba(255,255,255,0.05)",
                    color: active
                      ? isMovie
                        ? "#f5c518"
                        : "#60a5fa"
                      : "rgba(232,232,240,0.65)",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {g.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "24px clamp(16px,4vw,48px) 60px",
        }}
      >
        {/* Initial skeleton */}
        {loading && items.length === 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))",
              gap: 14,
            }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && items.length === 0 && (
          <div
            style={{ textAlign: "center", padding: "80px 0", color: "#8888a8" }}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: 14 }}>
              {isMovie ? "🎬" : "📺"}
            </div>
            <p style={{ fontSize: "1rem", fontWeight: 600, color: "#e8e8f0" }}>
              No results found
            </p>
            <p style={{ fontSize: "0.85rem", marginTop: 6 }}>
              Try adjusting your filters
            </p>
          </div>
        )}

        {/* Cards */}
        {items.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))",
              gap: 14,
            }}
          >
            {items.map((item, idx) => (
              <MovieCard
                key={`${item.id}-${idx}`}
                movie={item}
                priority={idx < 6}
              />
            ))}
            {/* Append skeletons when loading more */}
            {loading &&
              Array.from({ length: 10 }).map((_, i) => (
                <SkeletonCard key={`sk-${i}`} />
              ))}
          </div>
        )}

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} style={{ height: 1, marginTop: 20 }} />

        {/* Spinner */}
        {loading && items.length > 0 && (
          <div style={{ textAlign: "center", padding: "28px 0" }}>
            <div
              style={{
                width: 30,
                height: 30,
                border: `3px solid ${isMovie ? "rgba(245,197,24,0.2)" : "rgba(96,165,250,0.2)"}`,
                borderTopColor: isMovie ? "#f5c518" : "#60a5fa",
                borderRadius: "50%",
                animation: "disc-spin 0.75s linear infinite",
                margin: "0 auto",
              }}
            />
          </div>
        )}

        {/* End message */}
        {!hasMore && !loading && items.length > 0 && (
          <p
            style={{
              textAlign: "center",
              color: "#8888a8",
              fontSize: "0.85rem",
              padding: "32px 0 0",
            }}
          >
            You&apos;ve explored all {total.toLocaleString()}{" "}
            {isMovie ? "movies" : "shows"} 🎉
          </p>
        )}
      </div>

      <style>{`
        @keyframes disc-spin { to { transform: rotate(360deg); } }
        select option { background: #12121a; color: #e8e8f0; }
      `}</style>
    </div>
  );
}
