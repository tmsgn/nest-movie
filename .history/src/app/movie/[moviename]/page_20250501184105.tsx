export default function MoviePage({
  params,
}: {
  params: { moviename: string; movieid: string };
}) {
  const { moviename, movieid } = params;

  return (
    <div>
      <h1>Movie: {moviename.replace(/-/g, " ")}</h1>
      <p>Movie ID: {movieid}</p>
      <p>Details about the movie will be displayed here.</p>
    </div>
  );
}
