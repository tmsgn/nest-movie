import Image from "next/image";
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[] | string[];
  media_type: "movie" | "tv" | string;
}

export default function MovieCard({ movie }: { movie: Movie }) {
  const itemTitle = movie.title || movie.name || "Untitled";
  const releaseYear = movie.release_date || movie.first_air_date
    ? new Date(movie.release_date || movie.first_air_date).getFullYear()
    : "Unknown";

  return (
    <Link href={`/movie/${movie.id}/${encodeURIComponent(itemTitle)}`}>
      <a>
        <div>
          {movie.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={itemTitle}
              width={200}
              height={300}
            />
          ) : (
            <div className="placeholder">No Image Available</div>
          )}
          <h3>{itemTitle}</h3>
          <p>{releaseYear}</p>
        </div>
      </a>
    </Link>
  );
}