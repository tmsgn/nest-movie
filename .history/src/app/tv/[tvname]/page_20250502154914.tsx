import { Metadata } from "next";

type TVShow = {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: string;
  vote_average: number;
  overview: string;
};

async function getTVShowDetails(name: string) {
  const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";
  const response = await fetch(
    `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${name}`
  );
  const data = await response.json();
  return data.results[0] as TVShow;
}

export function generateMetadata({
  params,
}: {
  params: { tvname: string };
}): Metadata {
  const title = decodeURIComponent(params.tvname);
  return {
    title: `${title.charAt(0).toUpperCase()}${title.slice(1)}`,
    description: `Watch ${title.charAt(0).toUpperCase()}${title.slice(1)} on MovieNest`,
  };
}

export default async function TVPage({
  params,
}: {
  params: { tvname: string };
}) {
  const tvTitle = params.tvname.replace(/-/g, " ");
  const tvShow = await getTVShowDetails(tvTitle);

  if (!tvShow) {
    return <div>TV Show not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <div className="max-w-4xl w-full p-4">
        <h1 className="text-4xl font-bold text-center mb-4">{tvShow.name}</h1>

        <div className="text-center mb-6">
          <p className="text-lg">
            {new Date(tvShow.first_air_date).getFullYear()}
          </p>
          <p className="text-sm font-medium text-gray-400">
            {tvShow.vote_average} / 10
          </p>
        </div>

        <div className="relative pb-[56.25%] h-0 overflow-hidden mb-8">
          <iframe
            src={`https://vidfast.pro/tv/${tvShow.id}/1/1`}
            className="w-full h-[500px] rounded-lg shadow-md"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
          ></iframe>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="text-sm text-gray-300">{tvShow.overview}</p>
        </div>
      </div>
    </div>
  );
}
