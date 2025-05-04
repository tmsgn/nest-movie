import { Metadata } from 'next'

type Props = {
  params: { moviename: string }
}

export function generateMetadata({ params }: Props): Metadata {
  const title = decodeURIComponent(params.moviename)

  return {
    title: `${title}`,
    description: `Information about the movie "${title}".`
  }
}

export default function MoviePage({ params }: Props) {
  const moviename = decodeURIComponent(params.moviename)
  const movieId = moviename.split('-')[0] // Assuming movieId is passed as first segment
  
  return (
    <iframe 
      src={`https://vidfast.pro/movie/${movieId}`}
      className="w-full h-screen"
    />
  )
}