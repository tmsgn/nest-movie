"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { searchMovies } from "@/lib/fetchMovies";
import { useRouter } from "next/navigation";
import { FiSearch, FiX, FiMenu, FiHeart, FiHome } from "react-icons/fi";
import { MdLocalMovies } from "react-icons/md";

type SearchResult = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  media_type: string;
  vote_average?: number;
};

export default function NavBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setDropdownOpen(false);
      return;
    }
    setLoading(true);
    setDropdownOpen(true);
    const t = setTimeout(() => {
      searchMovies(query)
        .then((data: SearchResult[]) => {
          const filtered = data
            .filter((item) => item.poster_path && (item.title || item.name))
            .slice(0, 8)
            .map((item) => ({
              id: item.id,
              title: item.title ?? item.name ?? "Untitled",
              poster_path: item.poster_path,
              release_date: item.release_date ?? item.first_air_date ?? "",
              media_type: item.media_type ?? "movie",
            }));
          setResults(filtered);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = query.trim().replace(/\s+/g, "-").toLowerCase();
    if (slug) router.push(`/search/${encodeURIComponent(slug)}`);
    closeDropdown();
  };

  const closeDropdown = () => {
    setTimeout(() => {
      setDropdownOpen(false);
      setResults([]);
      setQuery("");
    }, 150);
  };

  const navLinks = [
    { href: "/", label: "Home", icon: <FiHome size={15} /> },
    { href: "/favorites", label: "Watchlist", icon: <FiHeart size={15} /> },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
        background: scrolled
          ? "rgba(10,10,20,0.96)"
          : "linear-gradient(180deg,rgba(10,10,20,0.88) 0%,transparent 100%)",
        backdropFilter: scrolled ? "blur(18px)" : "blur(4px)",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "blur(4px)",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.07)"
          : "1px solid transparent",
        padding: scrolled ? "10px 0" : "14px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              background: "linear-gradient(135deg,#f5c518,#e8a800)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MdLocalMovies size={20} color="#0a0a0f" />
          </div>
          <span
            style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              background:
                "linear-gradient(135deg,#f5c518 0%,#ffdd57 60%,#e8a800 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em",
            }}
          >
            NestMovie
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul
          style={{
            display: "flex",
            gap: 4,
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
          className="hidden-mobile"
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 14px",
                  borderRadius: 8,
                  color: "rgba(232,232,240,0.8)",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "rgba(245,197,24,0.1)";
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "#f5c518";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color =
                    "rgba(232,232,240,0.8)";
                }}
              >
                {link.icon}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Search — always visible input */}
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            flex: 1,
            maxWidth: 380,
          }}
        >
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#8888a8",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            <FiSearch size={15} />
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search movies &amp; shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setDropdownOpen(true);
            }}
            onBlur={closeDropdown}
            style={{
              width: "100%",
              paddingLeft: 38,
              paddingRight: query ? 36 : 14,
              paddingTop: 9,
              paddingBottom: 9,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.13)",
              borderRadius: 10,
              color: "#e8e8f0",
              fontSize: "0.88rem",
              outline: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLInputElement).style.borderColor =
                "rgba(245,197,24,0.4)";
            }}
            onMouseLeave={(e) => {
              if (document.activeElement !== e.currentTarget)
                (e.currentTarget as HTMLInputElement).style.borderColor =
                  "rgba(255,255,255,0.13)";
            }}
          />
          {query && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                setQuery("");
                setResults([]);
                setDropdownOpen(false);
              }}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#8888a8",
                cursor: "pointer",
                padding: 2,
              }}
            >
              <FiX size={15} />
            </button>
          )}

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              className="scrollbar"
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                right: 0,
                maxHeight: 340,
                overflowY: "auto",
                background: "rgba(14,14,22,0.99)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
                zIndex: 200,
              }}
            >
              {loading ? (
                <div
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    color: "#8888a8",
                    fontSize: "0.88rem",
                  }}
                >
                  Searching...
                </div>
              ) : results.length > 0 ? (
                results.map((movie) => {
                  const titleSlug = (movie.title ?? "untitled")
                    .toLowerCase()
                    .replace(/\s+/g, "-");
                  const href = `/${movie.media_type}/${movie.id}/${encodeURIComponent(titleSlug)}`;
                  return (
                    <Link
                      key={`${movie.media_type}-${movie.id}`}
                      href={href}
                      onMouseDown={(e) => e.preventDefault()} // prevent blur before click
                      onClick={() => {
                        setQuery("");
                        setResults([]);
                        setDropdownOpen(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 14px",
                        textDecoration: "none",
                        color: "#e8e8f0",
                        transition: "all 0.15s",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                      onMouseEnter={(e) => {
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.background = "rgba(245,197,24,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        (
                          e.currentTarget as HTMLAnchorElement
                        ).style.background = "transparent";
                      }}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                        alt={movie.title}
                        style={{
                          width: 36,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: 6,
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {movie.title}
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 3 }}>
                          <span
                            style={{ fontSize: "0.75rem", color: "#8888a8" }}
                          >
                            {(movie.release_date as string)?.slice(0, 4) || "—"}
                          </span>
                          <span
                            style={{
                              fontSize: "0.68rem",
                              fontWeight: 700,
                              color:
                                movie.media_type === "tv"
                                  ? "#60a5fa"
                                  : "#f5c518",
                              background:
                                movie.media_type === "tv"
                                  ? "rgba(96,165,250,0.12)"
                                  : "rgba(245,197,24,0.12)",
                              padding: "1px 7px",
                              borderRadius: 99,
                            }}
                          >
                            {movie.media_type === "tv" ? "TV" : "MOVIE"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    color: "#8888a8",
                    fontSize: "0.88rem",
                  }}
                >
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}
            </div>
          )}
        </form>

        {/* Mobile menu button */}
        <button
          className="show-mobile"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            padding: 8,
            color: "#e8e8f0",
            cursor: "pointer",
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="show-mobile"
          style={{
            background: "rgba(10,10,20,0.97)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            padding: "12px 20px 16px",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 4px",
                color: "rgba(232,232,240,0.85)",
                textDecoration: "none",
                fontSize: "0.95rem",
                fontWeight: 500,
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 640px) { .hidden-mobile{display:flex!important} .show-mobile{display:none!important} }
        @media (max-width: 639px) { .hidden-mobile{display:none!important} .show-mobile{display:flex!important} }
      `}</style>
    </nav>
  );
}
