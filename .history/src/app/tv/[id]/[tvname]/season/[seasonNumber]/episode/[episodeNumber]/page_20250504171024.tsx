// page.tsx
import { useEffect, useState } from "react";
import EpisodePageContent from "./EpsoidePage";
import { fetchTvShowDetail, fetchTvShowEpisodes } from "@/lib/fetchMovies";

type TvPageProps = {
  tvshowId: string;
  seasonNumber: string;
};

export default function TvPage({ tvshowId, seasonNumber }: TvPageProps) {
  const [tvshow, setTvshow] = useState<any | null>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number>(parseInt(seasonNumber));
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tvshowData = await fetchTvShowDetail(tvshowId);
        const episodesData = await fetchTvShowEpisodes(tvshowId, selectedSeason);
        setTvshow(tvshowData);
        setEpisodes(episodesData.episodes || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [tvshowId, selectedSeason]);

  if (!tvshow || episodes.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-screen h-full overflow-x-hidden">
      <EpisodePageContent
        tvshow={tvshow}
        episodes={episodes}
        selectedSeason={selectedSeason}
        currentPage={currentPage}
      />
    </div>
  );
}
