import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { movieid: string; moviename: string };
}): Promise<Metadata> {
  return {
    title: `Movie: ${params.moviename}`,
  };
}

export default function MoviePage({
  params,
}: {
  params: { movieid: string; moviename: string };
}) {
  const { movieid, moviename } = params;

  return (
    <div>
      <h1>Movie ID: {movieid}</h1>
      <h2>Movie Name: {moviename}</h2>
    </div>
  );
}