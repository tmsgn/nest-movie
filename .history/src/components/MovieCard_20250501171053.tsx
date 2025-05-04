// src/components/MovieCard.tsx
import Image from 'next/image'

type Movie = {
  id: number
  title: string
  poster_path: string
  release_date: string
  vote_average: number
  genres: string[]
}

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="cursor-pointer transition-transform transform hover:scale-105">
        <div>
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          width={500}          
          height={750}         
          className="object-cover rounded-lg"
        />
        </div>
        <div className="mt-2 text-sm">
            <h1>{movie.title}</h1>
           <dir></dir>
        </div>
    </div>
  )
}