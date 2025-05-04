import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { moviename: string };
}): Promise<Metadata> {
  const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";
  const movieTitle = params.moviename.replace(/-/g, " ");

  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${movieTitle}`
  );
  const data = await response.json();
  const movie = data.results[0];

  return {
    title: movie ? `${movie.title} | NestMovie` : "Movie Not Found",
    description: movie?.overview || "Watch this movie on NestMovie",
  };
}

export default function MovieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
