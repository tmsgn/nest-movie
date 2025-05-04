import React from "react";
import Image from "next/image";

type Tvshow = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  name: string;
  seasons: { id: number; season_number: number }[];
  first_air_date: string;
  origin_country: string[];
  genres: { id: number; name: string }[];
};

type CastMember = {
  name: string;
  character: string;
};

type Episode = {
  season_number: number;
  episode_number: number;
  name: string;
  overview: string;
};

const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";

async function getTvshowDetails(title: string) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${title}`
    );
    const data = await response.json();
    return data.results?.[0] as Tvshow;
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    return null;
  }
}

async function getTvshowCast(tvshowId: number) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${tvshowId}/credits?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.cast as CastMember[];
  } catch (error) {
    console.error("Error fetching TV show cast:", error);
    return [];
  }
}

async function getEpisodesBySeason(
  tvshowId: number,
  seasons: { id: number; season_number: number }[]
) {
  const episodesBySeason: { [seasonNumber: number]: Episode[] } = {};
  for (const season of seasons) {
    if (season.season_number === 0) continue;
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${tvshowId}/season/${season.season_number}?api_key=${API_KEY}`
      );
      const seasonEpisodesData = await response.json();
      episodesBySeason[season.season_number] = seasonEpisodesData.episodes || [];
    } catch (error) {
      console.error(`Error fetching episodes for season ${season.season_number}:`, error);
      episodesBySeason[season.season_number] = [];
    }
  }
  return episodesBySeason;
}

export default async function TVpage({
  params,
}: {
  params: { tvname: string };
}) {
  const title = params.tvname.replace(/-/g, " ");
  const tvshow = await getTvshowDetails(title);

  if (!tvshow) {
    return <div>Error: TV show not found.</div>;
  }

  const tvshowDetail = await fetch(
    `https://api.themoviedb.org/3/tv/${tvshow.id}?api_key=${API_KEY}`
  )
    .then((res) => res.json())
    .catch((error) => {
      console.error("Error fetching TV show details:", error);
      return null;
    });

  if (!tvshowDetail) {
    return <div>Error: Unable to fetch TV show details.</div>;
  }

  const episodesBySeason = await getEpisodesBySeason(
    tvshow.id,
    tvshowDetail.seasons || []
  );
  const cast = await getTvshowCast(tvshow.id);

  return (
    <div>
      <div className="w-screen flex sm:flex-row flex-col">
        <div className="w-fit">
          <Image
            src={`https://image.tmdb.org/t/p/w500${tvshow?.poster_path}`}
            alt={tvshow?.title || "TV show poster"}
            width={500}
            height={750}
            className="object-cover max-w-72 h-96 rounded-lg"
          />
        </div>
        <div className="mx-4 text-ellipsis">
          <h1 className="text-3xl font-bold">{tvshow?.name}</h1>
          <div className="flex justify-around">
            <h1 className="text-sm font-medium text-gray-400">
              {new Date(tvshow?.first_air_date || "").getFullYear()}
            </h1>
            {tvshow?.vote_average && (
              <h1 className="">{tvshow?.vote_average.toFixed(1)}⭐</h1>
            )}
            <h1 className="bg-yellow-500 text-gray-700 font-medium p-[2px] rounded text-sm shadow-md">
              HD
            </h1>
          </div>
          <div>
            <h1>{tvshow?.overview}</h1>
            <h1 className="text-sm font-medium text-gray-400 mt-2">
              {tvshow?.genres?.map((genre) => genre.name).join(", ") || "No genres available"}
            </h1>
          </div>
        </div>
      </div>
        <div className="mt-4">
          <h2 className="text-2xl font-bold">Cast</h2>
          <ul>
            {cast.length > 0 ? (
              cast.map((member, index) => (
                <li key={index}>
                  {member.name} as {member.character}
                </li>
              ))
            ) : (
              <li>No cast information available</li>
            )}
          </ul>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl font-bold">Episodes by Season</h2>
          {Object.keys(episodesBySeason).length > 0 ? (
            Object.entries(episodesBySeason).map(([season, episodes]) => (
              <div key={season}>
                <h3 className="text-xl font-semibold">Season {season}</h3>
                <ul>
                  {episodes.map((episode) => (
                    <li key={episode.episode_number}>
                      {episode.episode_number}. {episode.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No episodes available</p>
          )}
        </div>
      </div>
    </div>
  );
}
