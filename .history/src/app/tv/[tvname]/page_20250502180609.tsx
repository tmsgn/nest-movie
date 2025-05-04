import { useEffect, useState } from "react";

type Tvshow = {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    overview: string;
  };
  async function getTvshowDetails(title: string) {
    const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";
    const response = await fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${title}`
    );
    const data = await response.json();
    return data.results[0] as Tvshow;
  }
export default function TVpage({params}:{params: {tvname: string}}) {
    const tvshowTitle = params.tvname.replace(/-/g, " ");
    const [tvshow, setTvshow] = useState<Tvshow | null>(null);

    useEffect(() => {
      async function fetchTvshow() {
        const fetchedTvshow = await getTvshowDetails(tvshowTitle);
        setTvshow(fetchedTvshow);
      }
      fetchTvshow();
    }, [tvshowTitle]);

  return (
    <div className=" p-4">
      <h1 className="text-2xl font-bold">TV Show Page</h1>
      <p>Here’s where you show TV show details!</p>
      {tvshow ? <h1>{tvshow.id}</h1> : <p>Loading...</p>}
    </div>
  );
}