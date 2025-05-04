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


export default function MoviePage() {
    return (
     ifrma
    )
  }
  