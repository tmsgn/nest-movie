"use client";

import { useState, useEffect } from "react";

type Season = {
  season_number: number;
  name: string;
  episode_count: number;
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
  const tvShow = searchData.results[0];

  if (!tvShow) return null;

  const detailsResponse = await fetch(
    `https://api.themoviedb.org/3/tv/${tvShow.id}?api_key=${API_KEY}`
  );
  const detailsData = await detailsResponse.json();

  return detailsData;
}

export default function TVPage({ params }: { params: { tvname: string } }) {
  const [tvShow, setTvShow] = useState<any>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);

  const tvTitle = decodeURIComponent(params.tvname).replace(/-/g, " ");

  useEffect(() => {
    async function fetchShow() {
      const details = await getTVShowDetails(tvTitle);
      setTvShow(details);
      if (details && details.seasons.length > 0) {
        setSelectedSeason(details.seasons[0].season_number);
      }
    }
    fetchShow();
  }, [tvTitle]);

  useEffect(() => {
    if (!tvShow) return;
    async function fetchEpisodes() {
      setLoading(true);
      const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${tvShow.id}/season/${selectedSeason}?api_key=${API_KEY}`
      );
      const data = await response.json();
      setEpisodes(data.episodes);
      setLoading(false);
    }
    fetchEpisodes();
  }, [selectedSeason, tvShow]);

  if (!tvShow) {
    return <div>Loading TV Show...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">{tvShow.name}</h1>

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p className="text-sm text-gray-300">{tvShow.overview}</p>
      </div>

      <div>
        <label htmlFor="season-select" className="block mb-2 text-lg">
          Select Season:
        </label>
        <select
          id="season-select"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(Number(e.target.value))}
          className="text-black px-2 py-1 rounded-lg mb-4"
        >
          {tvShow.seasons.map((season: Season) => (
            <option key={season.season_number} value={season.season_number}>
              {season.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Episodes</h3>
        {loading ? (
          <p>Loading episodes...</p>
        ) : (
          <ul className="list-disc pl-6 text-sm text-gray-300">
            {episodes.map((ep) => (
              <li key={ep.episode_number}>
                Episode {ep.episode_number}: {ep.name} ({ep.air_date})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
