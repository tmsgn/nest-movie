"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type EpisodeDetails = {
  name: string;
  overview: string;
  still_path: string | null;
};

const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";

export default function EpisodePage() {
  const params = useParams();
  const router = useRouter();
  const { tvname, id, seasonNumber, episodeNumber } = params as Record<string, string>;

  const [episode, setEpisode] = useState<EpisodeDetails | null>(null);

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}?api_key=${API_KEY}`
        );
        if (!res.ok) throw new Error("Failed to fetch episode details");
        const data = await res.json();
        setEpisode({
          name: data.name,
          overview: data.overview,
          still_path: data.still_path,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchEpisode();
  }, [id, seasonNumber, episodeNumber]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 px-4 py-8 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-6">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-400 hover:text-primary-500 transition"
        >
          ← Back
        </button>

        <h1 className="text-2xl md:text-3xl font-bold text-center">
          {tvname?.replace(/-/g, " ")} — S{seasonNumber}E{episodeNumber}
        </h1>

        {episode ? (
          <>
            <p className="text-center text-gray-400">{episode.name}</p>
            {episode.still_path && (
              <img
                src={`https://image.tmdb.org/t/p/w780${episode.still_path}`}
                alt={episode.name}
                className="rounded-lg mx-auto shadow-lg"
              />
            )}

            <div className="relative overflow-hidden rounded-xl shadow-lg border border-gray-800 aspect-video">
              <iframe
                src={`https://vidfast.pro/tv/${id}/${seasonNumber}/${episodeNumber}`}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-presentation"
              ></iframe>
            </div>

            <div className="bg-gray-900 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-2">Episode Overview</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{episode.overview || "No overview available."}</p>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-400">Loading episode details...</p>
        )}
      </div>
    </div>
  );
}
