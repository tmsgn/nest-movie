export default async function HomePage() {
  const movies = await getTrendingMovies();
  const tvShows = await getTrendingTVShows();

  if (!movies || !tvShows) {
    return <div>Failed to load content.</div>;
  }

  return (
    <main className="md:p-4 p-1 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 m-3">Trending Movies</h1>
      <div className="grid lg:grid-cols-8 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-3">
        {movies.map((movie: Movie) => (
          <MovieCard key={movie.id} item={movie} />
        ))}
      </div>

      <h1 className="text-3xl font-bold text-yellow-400 m-3">Trending TV Shows</h1>
      <div className="grid lg:grid-cols-8 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-3">
        {tvShows.map((tvshow: TVShow) => (
          <MovieCard key={tvshow.id} item={tvshow} />
        ))}
      </div>
    </main>
  );
}