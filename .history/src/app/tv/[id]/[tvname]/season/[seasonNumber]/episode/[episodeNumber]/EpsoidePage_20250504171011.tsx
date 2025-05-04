// components/EpisodePageContent.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type EpisodePageContentProps = {
  tvshow: any;
  episodes: any[];
  selectedSeason: number;
  currentPage: number;
};

export default function EpisodePageContent({
  tvshow,
  episodes,
  selectedSeason,
  currentPage,
}: EpisodePageContentProps) {
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null);

  const episodesPerPage = 12;
  const totalPages = Math.ceil(episodes.length / episodesPerPage);
  const startIndex = (currentPage - 1) * episodesPerPage;
  const endIndex = startIndex + episodesPerPage;
  const currentEpisodes = episodes.slice(startIndex, endIndex);

  const handleEpisodeClick = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber);
  };

  return (
    <div className="w-screen h-full overflow-x-hidden">
      <div className="w-full flex flex-col gap-4">
        <div className="flex">
          <iframe
            src={`https://vidfast.pro/tv/${tvshow.id}/${selectedSeason}/${selectedEpisode}`}
            className="w-2/3 h-[75vh] rounded-lg shadow-md"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
          ></iframe>
          <div className="flex flex-col w-1/3 mr-7 ml-2">
            <div className="flex">
              <Image
                className="rounded-lg h-fit"
                src={`https://image.tmdb.org/t/p/w500${tvshow.poster_path}`}
                alt={tvshow.name || "Episode Image"}
                width={200}
                height={300}
              />
              <div className="ml-4 flex flex-col justify-start">
                <h1 className="text-2xl font-bold line-clamp-2">{tvshow.name}</h1>
                <h1 className="mt-2 bg-yellow-400 w-fit p-0.5 rounded-sm text-gray-700">
                  S{selectedSeason}-E{tvshow.episodeNumber}
                </h1>
                <div className="mt-3 text-gray-300">
                  <span className="flex gap-2">
                    <h1>Release date:</h1>
                    <h1>
                      {new Date(tvshow.first_air_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h1>
                  </span>
                  <span className="flex gap-2 mt-2">
                    <h1>Language:</h1>
                    <h1>{tvshow.original_language.toUpperCase()}</h1>
                  </span>
                  <span className="flex gap-2 mt-2">
                    <h1>Status:</h1>
                    <h1>{tvshow.status}</h1>
                  </span>
                  <span className="flex gap-2 mt-2">
                    <h1>Rating:</h1>
                    <h1>
                      {tvshow.vote_average.toFixed(1)} / 10 ({tvshow.vote_count} votes)
                    </h1>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {tvshow.genres.map((g: any) => (
                    <span
                      key={g.id}
                      className="text-sm font-medium text-gray-700 bg-yellow-400 px-2 py-1 rounded"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h1 className="mt-4 text-lg font-bold text-yellow-400">Description:</h1>
              {tvshow.overview && <h1 className="line-clamp-9 mt-3">{tvshow.overview}</h1>}
            </div>
          </div>
        </div>

        <div className="mt-4 ml-4">
          <div className="flex items-center gap-2 mb-4 relative">
            <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-lg font-semibold flex items-center gap-2 cursor-pointer">
              Season {selectedSeason}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {currentEpisodes.map((episode) => (
              <Link
                key={episode.episode_number}
                href={`/tv/${tvshow.id}/${tvshow.name}/season/${selectedSeason}/episode/${episode.episode_number}`}
                className={`bg-gray-900 rounded-lg cursor-pointer transition-transform transform hover:scale-105 overflow-hidden shadow w-32 sm:w-36 md:w-40 lg:w-44 xl:w-48 ${episode.episode_number === selectedEpisode ? 'border-4 border-yellow-400' : ''}`}
                onClick={() => handleEpisodeClick(episode.episode_number)}
              >
                <img
                  src={episode.still_path ? `https://image.tmdb.org/t/p/w300${episode.still_path}` : `https://image.tmdb.org/t/p/w500${tvshow.poster_path}`}
                  alt={episode.name}
                  className="w-full h-20 sm:h-24 md:h-28 object-cover"
                />
                <div className="p-1">
                  <div className="font-semibold text-white text-sm truncate" title={episode.name}>
                    {episode.name}
                  </div>
                  <div className="text-xs text-gray-400">S{selectedSeason} E{episode.episode_number}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
