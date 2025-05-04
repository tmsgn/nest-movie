import { Metadata } from 'next'

type Props = {
  params: { moviename: string }
}

export function generateMetadata({ params }: Props): Metadata {
  const title = decodeURIComponent(params.moviename).replace(/-/g, ' ')

  return {
    title: `${title} | MovieNest`,
    description: `Information about the movie "${title}".`
  }
}


export default function MoviePage({ params }: { params: { moviename: string } }) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Movie: {decodeURIComponent(params.moviename)}</h1>
      </div>
    )
  }
  