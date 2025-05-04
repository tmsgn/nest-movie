"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { searchMovies } from "@/lib/fetchMovies";
import { useRouter } from "next/navigation";

type Movie = {
  id: number;
  title: string;
};

export default function NavBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (query.trim()) {
      setLoading(true);
      searchMovies(query)
        .then((data) => {
          setResults(data || []);
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
    setLoading(true);
    event.preventDefault();
    if (query.trim()) {
      router.push(
        `/search/${encodeURIComponent(
          query.toLowerCase().replace(/\s+/g, "-")
        )}`
      );
    }
    setLoading(false);
    setQuery("");
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 shadow-md w-screen overflow-x-hidden">
      <div className="relative max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4">
        <Link href="/" className="text-2xl font-bold text-yellow-400">
          MovieNest
        </Link>

        <ul className="flex gap-4 items-center">
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
          className=" flex items-center w-full max-w-md"
          onSubmit={handleSearchSubmit}
        >
          <input
            type="text"
            name="query"
            placeholder="Search movies..."
            aria-label="Search movies"
            className="w-full px-3 py-1 rounded-l bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            aria-label="Search"
            className="px-3 py-1 rounded-r bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
          >
            Search
          </button>

          <div className="absolute mt-12 bg-red-500 w-full h-full">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                <svg
                  className="animate-spin h-5 w-5 text-yellow-400"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="yellow"
                    d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1.5 15h-3v-3h3v3zm1.5-4.5h-6V7h6v5.5z"
                  />
                </svg>
              </div>
            )}
            {results.length > 0 && (
              <ul className="absolute mt-12 bg-gray-800 rounded-lg shadow-lg z-10 w-full max-h-[200px] overflow-y-auto">
                {results.map((movie) => (
                  <li key={movie.id} className="p-2 hover:bg-gray-700">
                    <Link
                      href={`/${movie.title.replace(/\s+/g, "-").toLowerCase()}`}
                      onClick={() => setQuery("")}
                      className="text-white block"
                    >
                      {movie.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </form>
      </div>
    </nav>
  );
}
