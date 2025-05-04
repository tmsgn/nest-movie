import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { moviename: string };
}): Promise<Metadata> {
  const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";
  const movieTitle = params.moviename.replace(/-/g, " ");

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${movieTitle}`
    );
    const data = await response.json();
    const movie = data.results[0];

    if (!movie) {
      return {
        title: "Movie Not Found",
        description: "The requested movie could not be found.",
      };
    }

    return {
      title: `${movie.title}`,
      description: movie.overview || "Watch this movie on NestMovie",
      openGraph: {
        title: movie.title,
        description: movie.overview || "Watch this movie on NestMovie",
        images: [`https://image.tmdb.org/t/p/w500${movie.poster_path}`],
      },
    };
  } catch (error) {
    return {
      title: "Error",
      description: "An error occurred while fetching movie details.",
    };
  }
}

export default function MovieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
