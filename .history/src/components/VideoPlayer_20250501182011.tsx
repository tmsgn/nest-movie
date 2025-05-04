interface VideoPlayerProps {
  movieId: number;
}

export default function VideoPlayer({ movieId }: VideoPlayerProps) {
  return (
    <div className="relative w-full aspect-video">
      <iframe
        src={`https://vidsrc.to/embed/movie/${movieId}`}
        className="absolute top-0 left-0 w-full h-full"
        allowFullScreen
      />
    </div>
  );
}
