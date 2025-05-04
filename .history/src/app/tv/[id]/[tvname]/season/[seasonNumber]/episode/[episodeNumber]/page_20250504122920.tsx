"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

const mockSeasons = [
  { seasonNumber: 1, episodes: [1, 2, 3, 4, 5] },
  { seasonNumber: 2, episodes: [1, 2, 3] },
  { seasonNumber: 3, episodes: [1, 2, 3, 4] },
];

export default function EpisodePage() {
  const params = useParams();
  const { tvname, id } = params as Record<string, string>;

  const [selectedSeason, setSelectedSeason] = useState(mockSeasons[0].seasonNumber);
  const [selectedEpisode, setSelectedEpisode] = useState(mockSeasons[0].episodes[0]);

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const season = parseInt(e.target.value);
    setSelectedSeason(season);
    const seasonData = mockSeasons.find((s) => s.seasonNumber === season);
    setSelectedEpisode(seasonData?.episodes[0] ?? 1);
  };

  const handleEpisodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEpisode(parseInt(e.target.value));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 px-4 py-8 flex flex-col items-center">
      <div className="max-w-3xl w-full space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-primary-500">
          {tvname?.replace(/-/g, " ")}
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <label className="flex flex-col text-sm">
            Season
            <select
              value={selectedSeason}
              onChange={handleSeasonChange}
              className="mt-1 bg-gray-800 text-white p-2 rounded-md"
            >
              {mockSeasons.map((season) => (
                <option key={season.seasonNumber} value={season.seasonNumber}>
                  Season {season.seasonNumber}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col text-sm">
            Episode
            <select
              value={selectedEpisode}
              onChange={handleEpisodeChange}
              className="mt-1 bg-gray-800 text-white p-2 rounded-md"
            >
              {mockSeasons
                .find((s) => s.seasonNumber === selectedSeason)
                ?.episodes.map((ep) => (
                  <option key={ep} value={ep}>
                    Episode {ep}
                  </option>
                ))}
            </select>
          </label>
        </div>

        <p className="text-center text-gray-400">
          Watching <strong>{tvname?.replace(/-/g, " ")}</strong> — Season {selectedSeason} Episode {selectedEpisode}
        </p>

        <div className="relative w-full overflow-hidden rounded-xl shadow-lg border border-gray-800 aspect-video">
          <iframe
            src={`https://vidfast.pro/tv/${id}/${selectedSeason}/${selectedEpisode}`}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
