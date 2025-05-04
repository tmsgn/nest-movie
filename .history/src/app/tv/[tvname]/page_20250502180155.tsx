type Tvshow = {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    overview: string;
  };
  
export default function TVpage() {
  return (
    <div className=" p-4">
      <h1 className="text-2xl font-bold">TV Show Page</h1>
      <p>Here’s where you show TV show details!</p>
      <h1>{TvShows.id}</h1>
    </div>
  );
}