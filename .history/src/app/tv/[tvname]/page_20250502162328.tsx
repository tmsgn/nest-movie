import { Metadata } from "next";

type TVShow = {
  id: number;
  name: string;
  overview: string;
  seasons: Season[];
};

type Season = {
  season_number: number;
  name: string;
  episode_count: number;
  air_date: string;
};

type Episode = {
  episode_number: number;
  name: string;
  air_date: string;
};

async function getTVShowDetails(tvname: string) {
  const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";
  const searchResponse = await fetch(
    `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${tvname}`
  );
  const searchData = await searchResponse.json();
  const tvShow = searchData.results[0] as TVShow;

  if (!tvShow) return null;

  const detailsResponse = await fetch(
    `https://api.themoviedb.org/3/tv/${tvShow.id}?api_key=${API_KEY}`
  );
  const detailsData = await detailsResponse.json();

  return detailsData as TVShow;
}

async function getSeasonEpisodes(tvId: number, seasonNumber: number) {
  const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.episodes as Episode[];
}

export function generateMetadata({
  params,
}: {
  params: { tvname: string };
}): Metadata {
  const title = decodeURIComponent(params.tvname);
  return {
    title: `${title.charAt(0).toUpperCase()}${title.slice(1)}`,
    description: `Watch info for ${title.charAt(0).toUpperCase()}${title.slice(1)} on MovieNest`,
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
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">{tvShow.name}</h1>

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p className="text-sm text-gray-300">{tvShow.overview}</p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Seasons</h2>
        {tvShow.seasons.map(async (season) => {
          const episodes = await getSeasonEpisodes(tvShow.id, season.season_number);

          return (
            <div key={season.season_number} className="mb-6">
              <h3 className="text-xl font-semibold text-yellow-400">
                {season.name} ({season.episode_count} episodes)
              </h3>
              <p className="text-sm text-gray-400 mb-2">
                Air date: {season.air_date || "Unknown"}
              </p>
              <ul className="list-disc pl-6 text-sm text-gray-300">
                {episodes.map((ep) => (
                  <li key={ep.episode_number}>
                    Episode {ep.episode_number}: {ep.name} ({ep.air_date})
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
