type Tvshow = {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    overview: string;
  };
  async function getMovieDetails(title: string) {
    const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${title}`
    );
    const data = await response.json();
    return data.results[0] as Movie;
  }
export default function TVpage() {
  return (
    <div className=" p-4">
      <h1 className="text-2xl font-bold">TV Show Page</h1>
      <p>Here’s where you show TV show details!</p>
      <h1>{Tvshow.id}</h1>
    </div>
  );
}