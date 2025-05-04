interface VideoPlayerProps {
  movieId?: number;
  src?: string;
}

export default function VideoPlayer({ movieId, src }: VideoPlayerProps) {
  const videoUrl = src || `https://vidsrc.to/embed/movie/${movieId}`;

  return (
    <div className="relative w-full aspect-video">
      <iframe
        src={videoUrl}
        className="absolute top-0 left-0 w-full h-full"
        allowFullScreen
      />
    </div>
  );
}
