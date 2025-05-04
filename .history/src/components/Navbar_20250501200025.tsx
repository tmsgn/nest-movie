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
    event.preventDefault();
    if (query.trim()) {
      router.push(
        `/search/${encodeURIComponent(
          query.toLowerCase().replace(/\s+/g, "-")
        )}`
      );
    }
  };

  const buttonCliked = () => {
    setQuery("");
    setResults([]);
  };

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4">
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
          className="relative flex items-center w-full max-w-md"
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
          {query && (
            <div className="absolute left-0 right-0 top-10 max-h-60 overflow-y-auto bg-gray-800 text-white rounded-md shadow-lg z-10">
              {loading ? (
                <div className="px-4 py-2 text-center text-gray-400">
                  Loading...
                </div>
              ) : results.length > 0 ? (
                results.map((movie) => (
                  <Link
                  onClick={()=>{
                    setQuery
                  }}
                  href={`/movie/${encodeURIComponent(movie.title.toLowerCase().replace(/\s+/g, "-"))}`}>
                    <h3 className="text-sm">{movie.title}</h3>
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
