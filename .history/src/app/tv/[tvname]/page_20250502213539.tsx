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

  // 🔥 Fetch trailer
  const videoRes = await fetch(
    `https://api.themoviedb.org/3/tv/${tvshow.id}/videos?api_key=${API_KEY}`
  );
  const videoData = await videoRes.json();
  const trailer = videoData.results.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube"
  );

  return (
    <div>
      <div className="w-screen flex sm:flex-row flex-col">
        <div className="w-full flex justify-center items-center sm:w-fit">
          <Image
            src={`https://image.tmdb.org/t/p/w500${tvshow?.poster_path}`}
            alt={tvshow?.title || "TV show poster"}
            width={500}
            height={750}
            className="object-cover max-w-72 h-96 rounded-lg"
          />
        </div>

        <div className="mx-4 md:max-w-1/3 ">
          <h1 className="text-3xl font-bold">{tvshow?.name}</h1>
          <div className="flex justify-around max-w-96">
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

            {tvshowDetail.genres && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tvshowDetail.genres.map((genre: { name: string }) => (
                  <span
                    key={genre.name}
                    className="text-sm font-medium text-gray-700 bg-yellow-400 p-1 rounded"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="w-full px-7 md:mt-0 mt-5">
        {trailer ? (
              <div className="">
                <h2 className="text-xl mb-4 text-yellow-400 font-semibold">Watch Trailer</h2>
                <iframe
                  width="100%"
                 height={'340'}
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg w-full "
                ></iframe>
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-500">No trailer available.</p>
            )}
        </div>
        
      </div>
      ds
    </div>
  );
}
