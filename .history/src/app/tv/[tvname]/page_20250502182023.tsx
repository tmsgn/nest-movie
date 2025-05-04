"use client";
import { useEffect, useState } from "react";

type Tvshow = {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    vote_average: number;
    overview: string;
    name: string;

};

type Episode = {
    season_number: number;
    episode_number: number;
    name: string;
    overview: string;
    seasons: number;
};

async function getTvshowDetails(title: string) {
    const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";
    const response = await fetch(
        `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${title}`
    );
    const data = await response.json();
    return data.results[0] as Tvshow;
}

export default function TVpage({ params }: { params: { tvname: string } }) {
    const tvshowTitle = params.tvname.replace(/-/g, " ");
    const [tvshow, setTvshow] = useState<Tvshow | null>(null);
    const [tvshowDetail, setTvshowDetail] = useState<Tvshow | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);

    useEffect(() => {
        async function fetchTvshow() {
            const fetchedTvshow = await getTvshowDetails(tvshowTitle);
            setTvshow(fetchedTvshow);

            if (fetchedTvshow) {
                const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";
                const response = await fetch(
                    `https://api.themoviedb.org/3/tv/${fetchedTvshow.id}?api_key=${API_KEY}`
                );
                const detailData = await response.json();
                setTvshowDetail(detailData);

                // Fetch episodes for the first season as an example
                if (detailData.seasons && detailData.seasons.length > 0) {
                    const seasonNumber = detailData.seasons[0].season_number;
                    const episodesResponse = await fetch(
                        `https://api.themoviedb.org/3/tv/${fetchedTvshow.id}/season/${seasonNumber}?api_key=${API_KEY}`
                    );
                    const episodesData = await episodesResponse.json();
                    setEpisodes(episodesData.episodes || []);
                }
            }
        }
        fetchTvshow();
    }, [tvshowTitle]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">TV Show Page</h1>
            <p>Here’s where you show TV show details!</p>
            <h1>{tvshow?.id}</h1>
            <h1>{tvshowDetail?.overview}</h1>
            <h1>Seasons</h1>
            <ul>
                {tvshowDetail?.seasons?.map((season) => (
                    <li key={season.id}>
                     {season.season_number}
                    </li>
                ))}
            </ul>
        </div>
    );
}
