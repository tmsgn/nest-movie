export default async function MoviePage({ params }: { params: { moviename: string } }) {
    const movieTitle = params.moviename.replace(/-/g, " ");
    const movie = await getMovieDetails(movieTitle);
  
    if (!movie) {
      return <div>Movie not found</div>;
    }
  
    // ✅ You can set your own video URL here:
    const videoUrl = "https://example.com/path/to/your/video.mp4";  // set your own link
  
    return (
      <div className="container mx-auto px-4 py-8">
        <VideoPlayer src={videoUrl} />
      </div>
    );
  }
  