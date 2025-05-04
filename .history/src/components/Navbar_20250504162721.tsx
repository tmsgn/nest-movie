"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { searchMovies } from "@/lib/fetchMovies";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";

type Movie = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  media_type: string;
};

export default function NavBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fuseOptions = { includeScore: true, threshold: 0.3, keys: ["title"] };

  useEffect(() => {
    if (query.trim()) {
      setLoading(true);
      searchMovies(query)
        .then((data) => {
          const fuse = new Fuse(data, fuseOptions);
          const normalized = query.trim().toLowerCase().replace(/\s+/g, " ");
          const filtered = fuse.search(normalized).map((item) => ({
            id: item.item.id,
            title: item.item.title ?? item.item.name ?? "Untitled",
            poster_path: item.item.poster_path,
            release_date:
              item.item.release_date ?? item.item.first_air_date ?? "",
            media_type: item.item.media_type ?? "movie",
          }));
          setResults(filtered);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedQuery = query.trim().replace(/\s+/g, "-").toLowerCase();
    if (normalizedQuery)
      router.push(`/search/${encodeURIComponent(normalizedQuery)}`);
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
            <Link href="/" className="hover:text-yellow-300">
              Home
            </Link>
          </li>
          <li>
            <Link href="/favorites" className="hover:text-yellow-300">
              Favorites
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-yellow-300">
              About
            </Link>
          </li>
        </ul>
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center w-full md:w-auto max-w-md"
        >
          <input
            type="text"
            placeholder="Search movies..."
            className="w-full px-3 py-2 rounded-l bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-r bg-yellow-400 text-black font-semibold hover:bg-yellow-300"
          >
            Search
          </button>

          {query && (
            <div className="absolute left-0 right-0 top-12 max-h-60 overflow-y-auto bg-gray-800 text-white rounded-md shadow-lg z-20 scrollbar">
              {loading ? (
                <div className="px-4 py-2 text-center text-gray-400">
                  Loading...
                </div>
              ) : results.length > 0 ? (
                results
                  .filter((movie) => movie.poster_path)
                  .map((movie) => (
                    <Link
                      key={movie.id}
                      href={`/${movie.media_type}/${
                        movie.id
                      }/${encodeURIComponent(
                        (movie.title ?? "untitled")
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                      )}`}
                      onClick={() => setQuery("")}
                      className="block px-4 py-2 hover:bg-yellow-500 rounded transition"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                          alt={movie.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div>
                          <span className="font-bold text-xs md:text-base">
                            {movie.title}
                          </span>
                          <div className="text-xs text-gray-400">
                            {movie.release_date || "Unknown Release Date"}
                          </div>
                          <div className="text-xs italic text-gray-500">
                            {movie.media_type === "tv" ? "TV Show" : "Movie"}
                          </div>
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
