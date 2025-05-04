// src/components/NavBar.tsx
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { searchMovies } from '@/lib/fetchMovies'; // This function should handle fetching the movies.

export default function NavBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce function to limit API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        setLoading(true);
        searchMovies(query).then((data) => {
          setResults(data);
          setLoading(false);
        });
      } else {
        setResults([]);
      }
    }, 500); // Delay for 500ms after typing

    return () => clearTimeout(timeoutId); // Clean up on each render
  }, [query]);

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 shadow-md">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4">
        <Link href="/" className="text-2xl font-bold text-yellow-400">MovieNest</Link>

        <ul className="flex gap-4 items-center">
          <li>
            <Link href="/" className="hover:text-yellow-300 transition">Home</Link>
          </li>
          <li>
            <Link href="/favorites" className="hover:text-yellow-300 transition">Favorites</Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-yellow-300 transition">About</Link>
          </li>
        </ul>

        <form className="relative flex items-center w-full max-w-md">
          <input
            type="text"
            name="query"
            placeholder="Search movies..."
            className="w-full px-3 py-1 rounded-l bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="px-3 py-1 rounded-r bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
          >
            Search
          </button>

          {/* Search Results Dropdown */}
          {query && results.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-gray-800 text-white rounded-md shadow-lg z-10">
              {loading ? (
                <div className="px-4 py-2 text-center text-gray-400">Loading...</div>
              ) : (
                results.map((movie) => (
                  <Link
                    key={movie.id}
                    href={`/movie/${encodeURIComponent(movie.title)}`}
                    className="block px-4 py-2 hover:bg-gray-700 cursor-pointer"
                  >
                    <h3 className="text-sm">{movie.title}</h3>
                  </Link>
                ))
              )}
            </div>
          )}
        </form>
      </div>
    </nav>
  );
}
