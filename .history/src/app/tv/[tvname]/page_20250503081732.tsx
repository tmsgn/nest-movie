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
  profile_path: string;
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
      episodesBySeason[season.season_number] =
        seasonEpisodesData.episodes || [];
    } catch (error) {
      console.error(
        `Error fetching episodes for season ${season.season_number}:`,
        error
      );
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
    return <div className="p-4 text-center">Error: TV show not found.</div>;
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
    return <div className="p-4 text-center">Error: Unable to fetch TV show details.</div>;
  }

  const episodesBySeason = await getEpisodesBySeason(
    tvshow.id,
    tvshowDetail.seasons || []
  );
  const cast = await getTvshowCast(tvshow.id);
  const videoRes = await fetch(
    `https://api.themoviedb.org/3/tv/${tvshow.id}/videos?api_key=${API_KEY}`
  );
  const videoData = await videoRes.json();
  const trailer = videoData.results.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube"
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Main Info Section */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="flex-shrink-0 flex justify-center md:justify-start">
          <Image
            src={`https://image.tmdb.org/t/p/w500${tvshow?.poster_path}`}
            alt={tvshow?.name || "TV show poster"}
            width={300}
            height={450}
            className="object-cover rounded-lg w-full max-w-[300px] h-auto"
          />
        </div>

        {/* Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{tvshow?.name}</h1>
          <div className="flex gap-4 mt-2">
            <span className="text-sm font-medium text-gray-400">
              {new Date(tvshow?.first_air_date || "").getFullYear()}
            </span>
            {tvshow?.vote_average && (
              <span>{tvshow?.vote_average.toFixed(1)}⭐</span>
            )}
            <span className="bg-yellow-500 text-gray-700 font-medium px-1 rounded text-xs shadow">
              HD
            </span>
          </div>
          <p className="mt-4">{tvshow?.overview}</p>
          {tvshowDetail.genres && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tvshowDetail.genres.map((genre: { name: string }) => (
                <span
                  key={genre.name}
                  className="text-sm font-medium text-gray-700 bg-yellow-400 px-2 py-1 rounded"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Trailer */}
        <div className="w-full md:w-1/3 mt-6 md:mt-0">
          {trailer ? (
            <div>
              <h2 className="text-xl mb-4 text-yellow-400 font-semibold">
                Watch Trailer
              </h2>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  width="100%"
                  height="auto"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="Trailer"
                  className="rounded-lg w-full h-[200px] sm:h-[250px] md:h-[300px]"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">No trailer available.</p>
          )}
        </div>
      </div>

      {/* Cast Section */}
      <div className="mt-12">
        <h1 className="text-2xl font-bold text-yellow-400 mb-4">Cast</h1>
        <div className="grid grid-cols-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {cast.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              {member.profile_path && (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
                  alt={member.name}
                  width={80}
                  height={120}
                  className="rounded-lg w-full h-auto object-cover aspect-[2/3]"
                />
              )}
              <h2 className="text-sm font-semibold mt-2 line-clamp-1">
                {member.name}
              </h2>
              <p className="text-xs text-gray-400 line-clamp-1">
                {member.character}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Episodes Section */}
      <div className="mt-12">
        <h1 className="text-2xl font-bold text-yellow-400 mb-4">Episodes</h1>
        {Object.keys(episodesBySeason).map((seasonNumber) => (
          <div key={seasonNumber} className="mb-8">
            <h2 className="text-xl font-semibold mb-2">
              Season {seasonNumber}
            </h2>
            <ul className="space-y-2">
              {episodesBySeason[parseInt(seasonNumber)].map((episode) => (
                <li key={episode.episode_number} className="pl-4">
                  <strong>{episode.name}</strong>: {episode.overview}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
