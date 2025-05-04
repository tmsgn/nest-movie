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

export default function TVpage({
  params,
}: {
  params: Promise<{ tvname: string }>;
}) {
  const [tvshow, setTvshow] = useState<Tvshow | null>(null);
  const [tvshowDetail, setTvshowDetail] = useState<Tvshow | null>(null);
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
    };
    fetchTvshow();
  }, [params]);

  return (
    <div className="flex">
      <div>
        {tvshow && tvshowDetail ? (
          <>
            <Image
              src={`https://image.tmdb.org/t/p/w500${tvshow.poster_path}`}
              alt={tvshow.name}
              width={300}
              height={450}
            />
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div>

      </div>
    </div>
  );
}
