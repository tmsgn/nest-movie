// app/tvpage/TVPageContent.tsx
'use client';
import React, { useState } from "react";
import Image from "next/image";

type Tvshow = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  name: string;
  seasons: { id: number; season_number: number }[];
  first_air_date: string;
  origin_country: string[];
  genres: { id: number; name: string }[];
};

type CastMember = {
  name: string;
  character: string;
  profile_path: string;
};

type Episode = {
  season_number: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string;
};

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
  const [selectedSeason, setSelectedSeason] = useState(
    Object.keys(episodesBySeason)[0] || "1"
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Main Info Section */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Poster */}
        <div className="flex-shrink-0 flex justify-center md:justify-start">
          <Image
            src={`https://image.tmdb.org/t/p/w500${tvshow?.poster_path}`}
            alt={tvshow?.name || "TV show poster"}
            width={300}
            height={450}
            className="object-cover rounded-lg w-full max-w-[300px] h-auto"
          />
        </div>

        {/* Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{tvshow?.name}</h1>
          <div className="flex gap-4 mt-2">
            <span className="text-sm font-medium text-gray-400">
              {new Date(tvshow?.first_air_date || "").getFullYear()}
            </span>
            {tvshow?.vote_average && (
              <span>{tvshow?.vote_average.toFixed(1)}⭐</span>
            )}
            <span className="bg-yellow-500 text-gray-700 font-medium px-1 rounded text-xs shadow">
              HD
            </span>
          </div>
          <p className="mt-4">{tvshow?.overview}</p>
          {tvshowDetail.genres && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tvshowDetail.genres.map((genre: { name: string }) => (
                <span
                  key={genre.name}
                  className="text-sm font-medium text-gray-700 bg-yellow-400 px-2 py-1 rounded"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Trailer */}
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

      {/* Cast Section */}
      <div className="mt-12">
        <h1 className="text-2xl font-bold text-yellow-400 mb-4">Cast</h1>
        <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {cast.slice(0, 6).map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              {member.profile_path && (
                <Image
                  src={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
                  alt={member.name}
                  width={80}
                  height={120}
                  className="rounded-lg w-full h-auto object-cover aspect-[2/3]"
                />
              )}
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

      {/* Episodes Section */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-4 relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg text-lg font-semibold flex items-center gap-2"
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
            <div className="absolute top-full cursor-pointer mt-2 bg-gray-800 text-white rounded-lg shadow-lg z-10">
              {Object.keys(episodesBySeason).map((season) => (
                <button
                  key={season}
                  onClick={() => {
                    setSelectedSeason(season);
                    setIsDropdownOpen(false);
                  }}
                  className="block px-4 py-2 hover:bg-gray-700 w-full text-left"
                >
                  Season {season}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="overflow-x-auto">
          <div className="flex flex-nowrap gap-4 pb-2">
            {episodesBySeason[parseInt(selectedSeason)]?.map((episode) => (
              <div
                key={episode.episode_number}
                className="flex-shrink-0 w-48 bg-gray-900 rounded-lg overflow-hidden shadow"
              >
                <img
                  src={
                    episode.still_path
                      ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
                      : "/placeholder.jpg"
                  }
                  alt={episode.name}
                  className="w-full h-28 object-cover"
                />
                <div className="p-2">
                  <div
                    className="font-semibold text-white text-base truncate"
                    title={episode.name}
                  >
                    {episode.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    Season {selectedSeason}&nbsp;&nbsp;Episode{" "}
                    {episode.episode_number}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
