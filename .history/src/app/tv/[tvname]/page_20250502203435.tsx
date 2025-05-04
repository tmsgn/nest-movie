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
  const response = await fetch(
    `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${title}`
  );
  const searchResults = await response.json();
  const tvshow = searchResults.results[0];

  if (tvshow) {
    const tvDetailsResponse = await fetch(
      `https://api.themoviedb.org/3/tv/${tvshow.id}?api_key=${API_KEY}`
    );
    const tvDetails = await tvDetailsResponse.json();
    return tvDetails;
  }

  return null;
}

async function getTvshowCast(tvshowId: number) {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${tvshowId}/credits?api_key=${API_KEY}`
  );
  return (await response.json()).cast as CastMember[];
}

async function getEpisodesBySeason(
  tvshowId: number,
  seasons: { id: number; season_number: number }[]
) {
  const episodesBySeason: { [seasonNumber: number]: Episode[] } = {};
  for (const season of seasons) {
    if (season.season_number === 0) continue;
    const seasonEpisodesData = await (
      await fetch(
        `https://api.themoviedb.org/3/tv/${tvshowId}/season/${season.season_number}?api_key=${API_KEY}`
      )
    ).json();
    episodesBySeason[season.season_number] = seasonEpisodesData.episodes || [];
  }
  return episodesBySeason;
}

export default async function TVpage({
  params: paramsPromise,
}: {
  params: Promise<{ tvname: string }>;
}) {
  const params = await paramsPromise;
  const title = params.tvname.replace(/-/g, " ");
  const tvshow = await getTvshowDetails(title);

  const tvshowDetail = await (
    await fetch(
      `https://api.themoviedb.org/3/tv/${tvshow.id}?api_key=${API_KEY}`
    )
  ).json();

  const episodesBySeason = await getEpisodesBySeason(
    tvshow.id,
    tvshowDetail.seasons
  );
  const cast = await getTvshowCast(tvshow.id);

  return (
    <div>
      <div className="w-screen flex sm:flex-row flex-col">
        <div className="w-fit ">
          <Image
            src={`https://image.tmdb.org/t/p/w500${tvshow?.poster_path}`}
            alt={tvshow?.title || "TV show poster"}
            width={500}
            height={750}
            className="object-cover max-w-72 h-96 rounded-lg"
          />
        </div>
        <div className="mx-4 text-ellipsis">
          <h1 className="text-3xl font-bold ">{tvshow?.name}</h1>
          <div className="flex justify-around md:w-1/2">
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
          <div className="max-w-2xl">
            <h1>{tvshow?.overview}</h1>
            {tvshowDetail?.genres && tvshow.genres && (
              <div className="flex flex-wrap mt-2">
                {tvshow?.genres && tvshow.genres.length > 0 ? (
                  tvshow.genres.map((genre: { id: number; name: string }) => (
                    <span
                      key={genre.id}
                      className="bg-yellow-400 text-gray-900 text-sm font-medium px-2 py-1 rounded mr-2 mb-2"
                    >
                      {genre.name}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">
                    No genres available
                  </span>
                )}
              </div>
            )}
            <h1>Country: {tvshow.origin_country?.join(", ") || ""}</h1>
            {cast && cast.length > 0 && (
              <div className="flex gap-3">
                <h2>Casts:</h2>

                {cast.slice(0, 3).map((member) => (
                  <h1 key={member.name}>{member.name}</h1>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
