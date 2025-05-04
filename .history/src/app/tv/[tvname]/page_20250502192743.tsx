"use client";
import { useEffect, useState } from "react";
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
  origin_country: string[]; // For country information
  genres: { id: number; name: string }[]; // For genre information
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
  return (await response.json()).results[0] as Tvshow;
}

async function getTvshowCast(tvshowId: number) {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${tvshowId}/credits?api_key=${API_KEY}`
  );
  return (await response.json()).cast as CastMember[];
}

export default function TVpage({
  params,
}: {
  params: Promise<{ tvname: string }>;
}) {
  const [tvshow, setTvshow] = useState<Tvshow | null>(null);
  const [tvshowDetail, setTvshowDetail] = useState<Tvshow | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]); // Added state for cast
  const [episodesBySeason, setEpisodesBySeason] = useState<{
    [seasonNumber: number]: Episode[];
  }>({});

  useEffect(() => {
    const fetchTvshow = async () => {
      const { tvname } = await params;
      const title = tvname.replace(/-/g, " ");
      const fetchedTvshow = await getTvshowDetails(title);
      setTvshow(fetchedTvshow);

      const detailData = await (
        await fetch(
          `https://api.themoviedb.org/3/tv/${fetchedTvshow.id}?api_key=${API_KEY}`
        )
      ).json();
      setTvshowDetail(detailData);

      const episodesData: { [seasonNumber: number]: Episode[] } = {};
      for (const season of detailData.seasons) {
        if (season.season_number === 0) continue;
        const seasonEpisodesData = await (
          await fetch(
            `https://api.themoviedb.org/3/tv/${fetchedTvshow.id}/season/${season.season_number}?api_key=${API_KEY}`
          )
        ).json();
        episodesData[season.season_number] = seasonEpisodesData.episodes || [];
      }
      setEpisodesBySeason(episodesData);

      // Fetch cast details
      const castData = await getTvshowCast(fetchedTvshow.id);
      setCast(castData);
    };
    fetchTvshow();
  }, [params]);

  console.log(tvshowDetail); // Debugging log to check the structure of tvshowDetail

  return (
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
      <div className="mx-4">
        <h1 className="text-3xl font-bold ">{tvshow?.name}</h1>
        <div className="flex justify-around">
        <h1 className="text-sm font-medium text-gray-400">
          {new Date(tvshow?.first_air_date || "").getFullYear()}
        </h1>
        {tvshow?.vote_average && (
            <h1 className="">{tvshow?.vote_average.toFixed(1)}⭐</h1>
        )}
        <h1 className="  bg-yellow-500 text-gray-700 font-medium p-[2px]  rounded text-sm shadow-md">HD</h1>

        </div>
      </div>
    </div>
  );
}
