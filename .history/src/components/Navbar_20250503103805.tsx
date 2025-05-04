"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { searchMovies } from "@/lib/fetchMovies";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
};

export default function NavBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fuseOptions = {
    includeScore: true,
    threshold: 0.3, // Adjust this for fuzziness control
    keys: ["title"],
  };

  const normalizeText = (text: string) => {
    return text.trim().replace(/\s+/g, " ").toLowerCase();
  };

  useEffect(() => {
    if (query.trim()) {
      setLoading(true);
      searchMovies(query)
        .then((data) => {
          if (data && data.length > 0) {
            const fuse = new Fuse(data, fuseOptions);
            const result = fuse.search(normalizeText(query));
            setResults(result.map((item) => item.item));
          } else {
            setResults([]);
          }
        })
        .catch(() => {
          setResults([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedQuery = normalizeText(query);
    if (normalizedQuery) {
      router.push(
        `/search/${encodeURIComponent(normalizedQuery.replace(/\s+/g, "-"))}`
      );
    }
    setQuery("");
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 shadow-md w-full">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-yellow-400">
          MovieNest
        </Link>
        <ul className="flex gap-6">
          <li>
            <Link href="/" className="hover:text-yellow-300 transition">
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/favorites"
              className="hover:text-yellow-300 transition"
            >
              Favorites
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-yellow-300 transition">
              About
            </Link>
          </li>
        </ul>
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center w-full max-w-md"
        >
          <input
            type="text"
            name="query"
            placeholder="Search movies..."
            aria-label="Search movies"
            className="w-full px-3 py-2 rounded-l bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            aria-label="Search"
            className="px-3 py-2 rounded-r bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
          >
            Search
          </button>
          {query && (
            <div className="absolute left-0 right-0 top-12 max-h-60 overflow-y-auto bg-gray-800 text-white rounded-md shadow-lg z-20">
              {loading ? (
                <div className="px-4 py-2 text-center text-gray-400">
                  Loading...
                </div>
              ) : results.length > 0 ? (
                results.map((movie) => (
                  <Link
                  key={movie.id}
                  href={`/movie/${encodeURIComponent(
                    movie.title.toLowerCase().replace(/\s+/g, "-")
                  )}`}
                  onClick={() => setQuery("")}
                  className="block px-4 py-2 text-white hover:bg-yellow-300 rounded transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` // Use TMDB image base URL
                          : "/images/placeholder.jpg" // Fallback image
                      }
                      alt={movie.title}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold line-clamp-1 text-xs md:text-base">
                        {movie.title}
                      </span>
                      <span className="text-xs md:text-sm text-gray-400">
                        {movie.release_date || "Unknown"}
                      </span>
                      <span></span>
                    </div>
                  </div>
                </Link>
                ))
              ) : (
                <div className="px-4 py-2 text-center text-gray-400">
                  No results found.
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </nav>
  );
}
