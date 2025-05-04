import Link from 'next/link'
import { searchMovies } from '@/lib/fetchMovies'
export default function NavBar() {


  const searchResults = async (query: string) => {
    const res = await searchMovies(query)
    if (!res) {
      return null
    }
    return res
  }
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

        <form action="/search" method="get" className="flex items-center">
          <input
            type="text"
            name="query"
            placeholder="Search movies..."
            className="px-3 py-1 rounded-l bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            type="submit"
            className="px-3 py-1 rounded-r bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
          >
            Search
          </button>
        </form>
      </div>
    </nav>
  )
}
