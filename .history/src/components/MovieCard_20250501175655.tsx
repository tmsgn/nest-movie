import Image from "next/image";

type Movie = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres: string[];
};

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <Link href={`/movie/${encodeURIComponent(movie.title)}`}>

    </Link>
    
  );
}
