import { Metadata } from 'next'
import { IM_Fell_Great_Primer } from 'next/font/google'

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
     <iframe
     src=`setIframeUrl(`https://vidfast.pro/movie/${media.id}`)``
     />
    )
  }
  