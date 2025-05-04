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

          <div className="absolute mt-12">
            fdfs
          </div>
        </form>
      </div>
    </nav>
  );
}
