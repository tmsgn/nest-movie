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
    <div className='relative'>
      <div className="cursor-pointer transition-transform transform hover:scale-105 relative">
        <div className='relative'>
          {/* Gray overlay only visible on hover */}
          <div className='absolute h-full w-full bg-gray-800 bg-opacity-50 rounded-lg opacity-0 hover:opacity-100 transition-opacity'></div>
          
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            width={500}          
            height={750}         
            className="object-cover rounded-lg"
          />
        </div>
        <div className="mt-2">
          <h1 className='text-xs md:text-sm font-medium text-gray-00 '>
            {new Date(movie.release_date).getFullYear()}
          </h1>
          <div>
            <h1 className='font-bold line-clamp-1'>{movie.title}</h1>
            <h1 className='md:text-sm text-xs font-medium line-clamp-1'>{movie.genres[1]}</h1>
          </div>
        </div>
      </div>
    </div>
  )
}
