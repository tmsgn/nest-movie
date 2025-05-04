// app/movie/[moviename]/page.tsx
import Image from "next/image";

type Props = {
    params: { moviename: string };
  };
  
  const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";
  
  async function getMovieByTitle(title: string) {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(title)}`
    );
    const data = await res.json();
    return data.results[0]; 
  }
  
  export default async function MoviePage({ params }: Props) {
    const movieName = params.moviename.replace(/-/g, " ");
    const movie = await getMovieByTitle(movieName);
  
    if (!movie) {
      return <div>Movie not found</div>;
    }
  
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">{movie.title}</h1>
        <p>Release date: {movie.release_date}</p>
        <p>Rating: {movie.vote_average}</p>
        <h1>{movie.id}</h1>
        <p>{movie.overview}</p>
        <div className="mt-4 relative w-[500px] h-[750px]">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    );
  }