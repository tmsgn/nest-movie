"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Tvshow = {
  id: number;
  name: string;
  poster_path: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
};
type Episode = {
  season_number: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string;
};
type CastMember = { name: string; character: string; profile_path: string };

export default function TVPageContent({
  tvshow,
  tvshowDetail,
  episodesBySeason,
  cast,
  trailer,
}: {
  tvshow: Tvshow;
  tvshowDetail: any;
  episodesBySeason: { [seasonNumber: number]: Episode[] };
  cast: CastMember[];
  trailer: any;
}) {
  const seasonKeys = Object.keys(episodesBySeason);
  const [selectedSeason, setSelectedSeason] = useState(seasonKeys[0] || "1");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const episodesPerPage = 6;

 
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [castLoaded, setCastLoaded] = useState<boolean[]>(() =>
    Array(cast.length).fill(false)
  );
  const [episodeLoaded, setEpisodeLoaded] = useState<boolean[]>(() =>
    Array(episodesBySeason[parseInt(selectedSeason)]?.length || 0).fill(false)
  );

  const episodes = episodesBySeason[parseInt(selectedSeason)] || [];
  const totalPages = Math.ceil(episodes.length / episodesPerPage);
  const currentEpisodes = episodes.slice(
    (currentPage - 1) * episodesPerPage,
    currentPage * episodesPerPage
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handleSeasonSelect = (season: string) => {
    setSelectedSeason(season);
    setCurrentPage(1);
    setIsDropdownOpen(false);
    setEpisodeLoaded(Array(episodesBySeason[parseInt(season)]?.length || 0).fill(false));
  };


  const handleCastLoad = (idx: number) => {
    setCastLoaded((prev) => {
      const arr = [...prev];
      arr[idx] = true;
      return arr;
    });
  };

  const handleEpisodeLoad = (idx: number) => {
    setEpisodeLoaded((prev) => {
      const arr = [...prev];
      arr[idx] = true;
      return arr;
    });
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
      {/* Main Info */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0 flex justify-center md:justify-start">
          <div className="relative w-[300px] h-[450px]">
            {!posterLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gray-300 rounded-lg" />
            )}
            <Image
              src={`https://image.tmdb.org/t/p/w500${tvshow.poster_path}`}
              alt={tvshow.name}
              width={300}
              height={450}
              className={`object-cover rounded-lg w-full max-w-[300px] h-auto ${!posterLoaded ? "invisible" : ""}`}
              onLoad={() => setPosterLoaded(true)}
              priority
            />
          </div>
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold">{tvshow.name}</h1>
          <div className="flex gap-4 mt-2">
            <span className="text-sm font-medium text-gray-400">
              {new Date(tvshow.first_air_date).getFullYear()}
            </span>
            <span>{tvshow.vote_average.toFixed(1)}⭐</span>
            <span className="bg-yellow-500  text-gray-700 font-medium px-1 rounded text-xs shadow">
              HD
            </span>
          </div>
          <p className="mt-4">{tvshow.overview}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {tvshowDetail.genres.map((g: any) => (
              <span
                key={g.id}
                className="text-sm font-medium text-gray-700 bg-yellow-400 px-2 py-1 rounded"
              >
                {g.name}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/3 mt-6 md:mt-0">
          {trailer ? (
            <div>
              <h2 className="text-xl mb-4 text-yellow-400 font-semibold">
                Watch Trailer
              </h2>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  width="100%"
                  height="auto"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title="Trailer"
                  className="rounded-lg w-full h-[200px] sm:h-[250px] md:h-[300px]"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-500">No trailer available.</p>
          )}
        </div>
      </div>

      {/* Cast */}
      <div className="mt-12 ">
        <h1 className="text-2xl font-bold text-yellow-400 mb-4">Cast</h1>
        <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {cast.slice(0, 6).map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative w-[80px] h-[120px]">
                {!castLoaded[index] && member.profile_path && (
                  <div className="absolute inset-0 animate-pulse bg-gray-300 rounded-lg" />
                )}
                {member.profile_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
                    alt={member.name}
                    width={80}
                    height={80}
                    className={`rounded-full object-cover w-[100px] h-[100px] ${!castLoaded[index] ? "invisible" : ""}`}
                    onLoad={() => handleCastLoad(index)}
                  />
                )}
              </div>
              <h2 className="text-sm font-semibold mt-2 line-clamp-1">
                {member.name}
              </h2>
              <p className="text-xs text-gray-400 line-clamp-1">
                {member.character}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Episodes */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-4 relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-lg font-semibold flex items-center gap-2 cursor-pointer"
          >
            Season {selectedSeason}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full  mt-2  max-h-40 overflow-y-scroll scrollbar bg-gray-800 text-white rounded-lg shadow-lg z-10">
              {seasonKeys.map((season) => (
                <button
                  key={season}
                  onClick={() => handleSeasonSelect(season)}
                  className="block px-4 py-2 w-full hover:text-yellow-400  text-left cursor-pointer"
                >
                  Season {season}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {currentEpisodes.map((episode, idx) => (
            <Link
              href={`/tv/${tvshow.id}/${tvshow.name}/season/${selectedSeason}/episode/${episode.episode_number}`}
              key={episode.episode_number}
              className="bg-gray-900 rounded-lg cursor-pointer transition-transform transform hover:scale-105 hover:bg-yellow-700 overflow-hidden shadow w-32 sm:w-36 md:w-40 lg:w-44 xl:w-48"
            >
              <div className="relative w-full" style={{ minHeight: "96px" }}>
                {!episodeLoaded[idx] && (
                  <div className="absolute inset-0 animate-pulse bg-gray-300" />
                )}
                <img
                  src={
                    episode.still_path
                      ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
                      : `https://image.tmdb.org/t/p/w500${tvshow.poster_path}`
                  }
                  alt={episode.name}
                  className={`w-full h-20 sm:h-24 md:h-28 object-cover ${!episodeLoaded[idx] ? "invisible" : ""}`}
                  onLoad={() => handleEpisodeLoad(idx)}
                />
              </div>
              <div className="p-1">
                <div
                  className="font-semibold text-white text-sm truncate"
                  title={episode.name}
                >
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
              currentPage === 1
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-yellow-400 cursor-pointer text-gray-800"
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
  );
}
