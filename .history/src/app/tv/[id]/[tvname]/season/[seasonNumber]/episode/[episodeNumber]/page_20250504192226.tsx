"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTvshowDetail, getTvshowEpisodes } from "@/lib/fetchMovies";

export default function EpisodePage() {
  const params = useParams();
  const router = useRouter();
  const { id, seasonNumber, episodeNumber } = params as Record<string, string>;

  const [tvshow, setTvshow] = useState<any>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<number>(Number(seasonNumber));
  const [seasonKeys, setSeasonKeys] = useState<number[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const episodesPerPage = 12;

  useEffect(() => {
    setLoading(true);
    async function fetchTvshow() {
      if (id) {
        const data = await getTvshowDetail(Number(id));
        setTvshow(data);
        if (data && data.seasons) {
          const keys = data.seasons
            .map((s: any) => s.season_number)
            .filter((num: number) => num > 0);
          setSeasonKeys(keys);
        }
      }
    }
    fetchTvshow();
    setLoading(false);
  }, [id]);

  useEffect(() => {
    async function fetchEpisodes() {
      if (id && selectedSeason) {
        const data = await getTvshowEpisodes(Number(id), selectedSeason);
        setEpisodes(data.episodes || []);
        setCurrentPage(1);
      }
    }
    fetchEpisodes();
  }, [id, selectedSeason]);

  const handleSeasonSelect = (season: number) => {
    setSelectedSeason(season);
    setIsDropdownOpen(false);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    const maxPages = Math.ceil(episodes.length / episodesPerPage);
    setCurrentPage((prev) => Math.min(prev + 1, maxPages));
  };

  const totalPages = Math.ceil(episodes.length / episodesPerPage);
  const startIndex = (currentPage - 1) * episodesPerPage;
  const endIndex = startIndex + episodesPerPage;
  const currentEpisodes = episodes.slice(startIndex, endIndex);

  if (!tvshow) {
    return null;
  }

  return (
    <div className="w-screen h-full overflow-x-hidden">
      <div className="flex flex-col mr-5 gap-4 px-1 sm:px-4">
        {/* IFRAME & DETAILS */}
        <div className="flex flex-col  lg:flex-row gap-4">
          <iframe
            src={`https://vidfast.pro/tv/${id}/${seasonNumber}/${episodeNumber}`}
            className="w-full lg:w-2/3 h-60 sm:h-[50vh] lg:h-[75vh] rounded-lg shadow-md"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
          ></iframe>
          <div className="flex flex-col lg:w-1/3">
            <div className="flex sm:flex-row gap-3">
              <Image
                className="rounded-lg w-36  sm:w-48 flex-1 mx-auto sm:mx-0 "
                src={`https://image.tmdb.org/t/p/w500${tvshow.poster_path}`}
                alt={tvshow.name || "Episode Image"}
                width={200}
                
              />
              <div className="sm:ml-4 flex flex-col justify-start mt-4 sm:mt-0">
                <h1 className="text-xl sm:text-2xl font-bold line-clamp-2">{tvshow.name}</h1>
                <h1 className="mt-2 bg-yellow-400 w-fit px-1 py-0.5 rounded-sm text-gray-700 text-sm">
                  S{seasonNumber}-E{episodeNumber}
                </h1>
                <div className="mt-3 text-gray-300 text-sm sm:text-base">
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
                      className="text-xs sm:text-sm font-medium text-gray-700 bg-yellow-400 px-2 py-1 rounded"
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h1 className="mt-4 text-base sm:text-lg font-bold text-yellow-400">Description:</h1>
              {tvshow.overview && <h1 className="line-clamp-8 mt-3 text-sm sm:text-base">{tvshow.overview}</h1>}
            </div>
          </div>
        </div>

        {/* DROPDOWN + EPISODES */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-4 relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg text-base sm:text-lg font-semibold flex items-center gap-2 cursor-pointer"
            >
              Season {selectedSeason}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full max-h-40 overflow-y-scroll scrollbar mt-2 bg-gray-800 text-white rounded-lg shadow-lg z-10">
                {seasonKeys.map((season) => (
                  <button
                    key={season}
                    onClick={() => handleSeasonSelect(season)}
                    className="block px-4 py-2 hover:bg-gray-700 w-full text-left cursor-pointer"
                  >
                    Season {season}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {currentEpisodes.map((episode) => (
              <Link
                key={episode.episode_number}
                href={`/tv/${tvshow.id}/${tvshow.name}/season/${selectedSeason}/episode/${episode.episode_number}`}
                className={`bg-gray-900 rounded-lg cursor-pointer transition-transform transform hover:scale-105 overflow-hidden shadow ${
                  episode.episode_number === Number(episodeNumber) && selectedSeason === Number(seasonNumber)
                    ? "border-4 border-yellow-400"
                    : ""
                }`}
              >
                <img
                  src={
                    episode.still_path
                      ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
                      : `https://image.tmdb.org/t/p/w500${tvshow.poster_path}`
                  }
                  alt={episode.name}
                  className="w-full h-20 sm:h-24 md:h-28 object-cover"
                />
                <div className="p-1">
                  <div className="font-semibold text-white text-xs sm:text-sm truncate" title={episode.name}>
                    {episode.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    S{selectedSeason} E{episode.episode_number}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1 ? "bg-gray-600 cursor-not-allowed" : "bg-yellow-400 cursor-pointer text-gray-800"
              }`}
            >
              Prev
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages || totalPages === 0
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-yellow-400 cursor-pointer text-gray-800"
              }`}
            >
              Next
            </button>
          </div>

          <div className="text-center mt-2 text-sm text-gray-400">
            Page {currentPage} of {totalPages || 1}
          </div>
        </div>
      </div>
    </div>
  );
}
