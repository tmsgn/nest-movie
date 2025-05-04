// page.tsx
"use client";

import { useEffect, useState } from "react";
import EpisodePageContent from "./EpsoidePage";
import { getTvshowDetail, getTvshowEpisodes } from "@/lib/fetchMovies";

export default function Page({ params }: { params: any }) {
    const [tvshow, setTvshow] = useState<any>(null);
    const [episodes, setEpisodes] = useState<any[]>([]);
    const [selectedSeason, setSelectedSeason] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        async function fetchData() {
            const tvshowDetail = await getTvshowDetail(params.id);
            const tvshowEpisodes = await getTvshowEpisodes(params.id, selectedSeason);
            setTvshow(tvshowDetail);
            setEpisodes(tvshowEpisodes);
        }
        fetchData();
    }, [params.id, selectedSeason]);

    if (!tvshow || episodes.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <EpisodePageContent
            tvshow={tvshow}
            episodes={episodes}
            selectedSeason={selectedSeason}
            currentPage={currentPage}
        />
    );
}
