"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";

type EpisodeDetails = {
  name: string;
  overview: string;
  still_path: string | null;
  vote_average: number;
  air_date: string;
};

export default function EpisodePage() {
  const params = useParams();
  const router = useRouter();
  const { tvname, id, seasonNumber, episodeNumber } = params as Record<string, string>;

  const [episode, setEpisode] = useState<EpisodeDetails | null>(null);
  const [seasonEpisodes, setSeasonEpisodes] = useState<any[]>([]);

  useEffect(() => {
    const fetchEpisode = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${API_KEY}`
      );
      const data = await res.json();
      setEpisode(data);
    };

    const fetchSeasonEpisodes = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}`
      );
      const data = await res.json();
      setSeasonEpisodes(data.episodes || []);
    };

    fetchEpisode();
    fetchSeasonEpisodes();
  }, [id, seasonNumber, episodeNumber]);

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen flex flex-col px-4 py-6 md:px-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* LEFT: Video Player */}
        <div className="flex-1">
          <div className="relative rounded-lg overflow-hidden shadow-lg aspect-video bg-black">
            <iframe
              src={`https://vidfast.pro/tv/${id}/${seasonNumber}/${episodeNumber}`}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation"
            ></iframe>
          </div>

          <div className="mt-4 flex gap-2">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-sm">
              Server 1
            </button>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-sm">
              Server 2
            </button>
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded text-sm">
              Server 3
            </button>
          </div>

          <h2 className="mt-6 text-lg font-bold">Season {seasonNumber}</h2>
          <div className="flex overflow-x-auto gap-4 py-4">
            {seasonEpisodes.map((ep) => (
              <div
                key={ep.episode_number}
                onClick={() =>
                  router.push(
                    `/tv/${tvname}/${id}/season/${seasonNumber}/episode/${ep.episode_number}`
                  )
                }
                className="min-w-[150px] cursor-pointer hover:scale-105 transition"
              >
                <img
                  src={
                    ep.still_path
                      ? `https://image.tmdb.org/t/p/w300${ep.still_path}`
                      : "/no-image.jpg"
                  }
                  alt={ep.name}
                  className="rounded-lg shadow-md"
                />
                <p className="text-sm mt-1 truncate">{ep.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Episode Info */}
        <div className="w-full md:w-80 bg-gray-900 rounded-lg p-4 shadow-lg flex flex-col">
          {episode ? (
            <>
              <h1 className="text-xl font-bold mb-2">{episode.name}</h1>
              <div className="flex items-center text-sm text-gray-400 gap-2">
                <span>S{seasonNumber}E{episodeNumber}</span>
                <span>·</span>
                <span>{episode.air_date?.slice(0, 4)}</span>
                <span>·</span>
                <span className="text-yellow-400">⭐ {episode.vote_average?.toFixed(1)}</span>
              </div>
              <button className="mt-3 text-purple-400 text-sm hover:underline">
                💜 Click to add to favorites
              </button>
              {episode.still_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                  alt={episode.name}
                  className="rounded-lg mt-4 shadow"
                />
              )}
              <div className="mt-4">
                <h2 className="font-semibold text-lg mb-1">Overview</h2>
                <p className="text-sm text-gray-300">{episode.overview || "No overview available."}</p>
              </div>
            </>
          ) : (
            <p>Loading episode info...</p>
          )}
        </div>
      </div>
    </div>
  );
}
