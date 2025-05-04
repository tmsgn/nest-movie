const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";

type MovieDetails = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  genres: { id: number; name: string }[];
};

async function getMovieDetails(movieId: string) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data as MovieDetails;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

async function getMovieCast(movieId: string) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.cast;
  } catch (error) {
    console.error("Error fetching movie cast:", error);
    return [];
  }
}

export default async function MoviePage({
  params,
}: {
  params: { movieId: string; moviename: string };
}) {
  const movieDetails = await getMovieDetails(params.movieId);

  if (!movieDetails) {
    return <div className="p-4 text-center">Error: Movie not found.</div>;
  }

  const cast = await getMovieCast(params.movieId);
  const videoRes = await fetch(
    `https://api.themoviedb.org/3/movie/${params.movieId}/videos?api_key=${API_KEY}`
  );
  const videoData = await videoRes.json();
  const trailer = videoData.results.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube"
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{movieDetails.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
            alt={movieDetails.title}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div>
          <p className="text-lg mb-4">{movieDetails.overview}</p>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Release Date</h2>
            <p>{new Date(movieDetails.release_date).toLocaleDateString()}</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Rating</h2>
            <p>{movieDetails.vote_average.toFixed(1)} ⭐</p>
          </div>
          {trailer && (
            <div className="mb-4">
              <h2 className="text-xl font-bold mb-2">Trailer</h2>
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Cast</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {cast?.slice(0, 6).map((member: any) => (
            <div key={member.id} className="text-center">
              <img
                src={
                  member.profile_path
                    ? `https://image.tmdb.org/t/p/w200${member.profile_path}`
                    : "/fallback-avatar.jpg"
                }
                alt={member.name}
                className="rounded-lg shadow-md mx-auto mb-2"
              />
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-gray-500">{member.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}