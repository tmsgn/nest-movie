import { getTrendingMovies, getTrendingTVShows } from "@/lib/fetchMovies";
import MovieCard from "@/components/MovieCard";
import MovieSlider from "@/components/MovieSlider";

export default async function HomePage() {
  const movies = await getTrendingMovies();
  const tvShows = await getTrendingTVShows();

  const movieArray = Array.isArray(movies) ? movies : [];
  const tvShowArray = Array.isArray(tvShows) ? tvShows : [];

  if (movieArray.length === 0 && tvShowArray.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "var(--clr-bg)",
          color: "#e8e8f0",
          gap: 16,
        }}
      >
        <div style={{ fontSize: "3rem" }}>🌐</div>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#f5c518" }}>
          You appear to be offline
        </h1>
        <p style={{ color: "#8888a8", fontSize: "0.92rem" }}>
          Please check your internet connection and try again.
        </p>
      </div>
    );
  }

  return (
    <main
      style={{
        background: "var(--clr-bg)",
        paddingTop: 68,
        minHeight: "100vh",
      }}
    >
      {/* Hero Slider */}
      {movieArray.length > 0 && (
        <MovieSlider
          movies={[
            ...movieArray
              .filter((movie) => movie.backdrop_path !== null)
              .map((movie) => ({
                id: movie.id,
                title: movie.title,
                vote_average: movie.vote_average,
                name: movie.name,
                backdrop_path: movie.backdrop_path,
                release_date: movie.release_date,
                first_air_date: movie.first_air_date,
                genre_names: movie.genres
                  ? Array.isArray(movie.genres)
                    ? movie.genres.map(
                        (g: string | { id: number; name: string }) =>
                          typeof g === "string" ? g : g.name,
                      )
                    : []
                  : [],
                media_type: "movie",
              })),
            ...tvShowArray
              .filter((tvshow) => tvshow.backdrop_path !== null)
              .map((tvshow) => ({
                id: tvshow.id,
                title: tvshow.title,
                name: tvshow.name,
                vote_average: tvshow.vote_average,
                backdrop_path: tvshow.backdrop_path,
                release_date: tvshow.release_date,
                first_air_date: tvshow.first_air_date,
                genre_names: tvshow.genres
                  ? Array.isArray(tvshow.genres)
                    ? tvshow.genres.map(
                        (g: string | { id: number; name: string }) =>
                          typeof g === "string" ? g : g.name,
                      )
                    : []
                  : [],
                media_type: "tv",
              })),
          ]}
        />
      )}

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 16px 60px" }}>
        {/* Trending Movies */}
        {movieArray.length > 0 && (
          <section style={{ marginBottom: 52 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div>
                <h2
                  className="section-heading"
                  style={{
                    fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                    fontWeight: 800,
                    color: "#fff",
                    margin: 0,
                  }}
                >
                  Trending Movies
                </h2>
                <p
                  style={{
                    color: "#8888a8",
                    fontSize: "0.82rem",
                    marginTop: 8,
                  }}
                >
                  Most popular movies this week
                </p>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                gap: 14,
              }}
            >
              {movieArray.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {/* Divider */}
        {movieArray.length > 0 && tvShowArray.length > 0 && (
          <div className="divider" />
        )}

        {/* Trending TV Shows */}
        {tvShowArray.length > 0 && (
          <section>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <div>
                <h2
                  className="section-heading"
                  style={{
                    fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                    fontWeight: 800,
                    color: "#fff",
                    margin: 0,
                  }}
                >
                  Trending TV Shows
                </h2>
                <p
                  style={{
                    color: "#8888a8",
                    fontSize: "0.82rem",
                    marginTop: 8,
                  }}
                >
                  Most popular series this week
                </p>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                gap: 14,
              }}
            >
              {tvShowArray.map((tvshow) => (
                <MovieCard key={tvshow.id} movie={tvshow} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
