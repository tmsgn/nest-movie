"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Episode {
  name: string;
  overview: string;
  still_path: string;
  air_date: string;
  episode_number: number;
  season_number: number;
  vote_average: number;
}

export default function EpisodePage() {
  const params = useParams();
  const { tvname, id, seasonNumber, episodeNumber } = params;
  const [episode, setEpisode] = useState<Episode | null>(null);
  const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";

  useEffect(() => {
    const fetchEpisodeDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${API_KEY}`
        );
        const data = await response.json();
        setEpisode(data);
      } catch (error) {
        console.error("Error fetching episode details:", error);
      }
    };

    fetchEpisodeDetails();
  }, [id, seasonNumber, episodeNumber]);

  if (!episode) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Episode Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{episode.name}</h1>
        <div className="text-gray-400">
          Season {episode.season_number} · Episode {episode.episode_number}
        </div>
        <div className="text-sm text-gray-400 mb-4">
          Air Date: {new Date(episode.air_date).toLocaleDateString()}
        </div>
        {episode.vote_average > 0 && (
          <div className="text-yellow-400">
            ⭐ {episode.vote_average.toFixed(1)}
          </div>
        )}
      </div>

      {/* Episode Image */}
      <div className="mb-8">
        <img
          src={`https://image.tmdb.org/t/p/w1280${episode.still_path}`}
          alt={episode.name}
          className="w-full rounded-lg shadow-lg"
        />
      </div>

      {/* Episode Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-300 leading-relaxed">{episode.overview}</p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => {
            if (episode.episode_number > 1) {
              window.location.href = `/tv/${id}/${tvname}/season/${seasonNumber}/episode/${episode.episode_number - 1}`;
            }
          }}
          disabled={episode.episode_number <= 1}
          className="bg-gray-800 px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Previous Episode
        </button>
        <button
          onClick={() => {
            window.location.href = `/tv/${id}/${tvname}/season/${seasonNumber}/episode/${episode.episode_number + 1}`;
          }}
          className="bg-gray-800 px-4 py-2 rounded-lg"
        >
          Next Episode
        </button>
      </div>
    </div>
  );
}
