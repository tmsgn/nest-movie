"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTvshowDetail, getTvshowEpisodes,RecommendedTvshows } from "@/lib/fetchMovies";
import MovieCard from "@/components/MovieCard";


type Tvshow = {
  id: number;
  name: string;
  poster_path: string;
  first_air_date: string;
  original_language: string;
  status: string;
  vote_average: number;
  vote_count: number;
  genres: { id: number; name: string }[];
}
type Epsoides= {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  season_number: number;
}
export default function EpisodePage() {
  const params = useParams();
  const router = useRouter();
  const { id, seasonNumber, episodeNumber } = params as Record<string, string>;

  const [tvshow, setTvshow] = useState<Tvshow | null>(null);
  const [episodes, setEpisodes] = useState<Epsoides[]>([]);
  const [recommendedTvshows, setRecommendedTvshows] = useState<Tvshow[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<number>(
    Number(seasonNumber)
  );
  const [seasonKeys, setSeasonKeys] = useState<number[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const episodesPerPage = 12;

  useEffect(() => {
   
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
  }, [id]);

  useEffect(() => {
    async function fetchRecommendedTvshows() {
      if (id) {
        const data = await RecommendedTvshows(Number(id));
        setRecommendedTvshows(data);
      }
    }
    fetchRecommendedTvshows();
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
        <div className="flex flex-col lg:flex-row gap-4">
          <iframe
            src={`https://vidfast.pro/tv/${id}/${seasonNumber}/${episodeNumber}?nextButton=false&autoNext=false`}
            className="w-full lg:w-2/3 md:min-h-96 min-h-64 sm:h-[60vh] md:h-[40vh] lg:h-[75vh] rounded-lg shadow-md"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
          ></iframe>
          <div className="flex flex-col  lg:w-1/3">
            <div className="flex sm:flex-row gap-3">
              <div className="w-36  min-w-36 max-w-52 flex-1 mx-auto sm:mx-0">
                <Image
                  className="rounded-lg w-full h-auto max-w-full object-cover"
                  src={`https://image.tmdb.org/t/p/w500${tvshow.poster_path}`}
                  alt={tvshow.name || "Episode Image"}
                  width={200}
                  height={300}
                />
              </div>
              <div className="sm:ml-4 flex flex-col justify-start">
                <h1 className="text-xl sm:text-2xl font-bold line-clamp-2">
                  {tvshow.name}
                </h1>
                <h1 className="mt-2 bg-yellow-400 w-fit px-1 py-0.5 rounded-sm text-gray-700 text-sm">
                  S{seasonNumber}-E{episodeNumber}
                </h1>
                <div className="mt-3 text-gray-300 space-y-1 text-sm sm:text-base">
                  <span className="flex gap-2">
                    <h1>Release date:</h1>
                    <h1>
                      {new Date(tvshow.first_air_date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </h1>
                  </span>
                  <span className="flex gap-2 md:mt-2">
                    <h1>Language:</h1>
                    <h1>{tvshow.original_language.toUpperCase()}</h1>
                  </span>
                  <span className="flex gap-2 md:mt-2">
                    <h1>Status:</h1>
                    <h1>{tvshow.status}</h1>
                  </span>
                  <span className="flex gap-2 md:mt-2">
                    <h1>Rating:</h1>
                    <h1>
                      {tvshow.vote_average.toFixed(1)} / 10 ({tvshow.vote_count}{" "}
                      votes)
                    </h1>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 md:mt-4">
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
              <h1 className="mt-4 text-base sm:text-lg font-bold text-yellow-400">
              Description:
              </h1>
              {episodes.length > 0 && (
              <h1 className="line-clamp-6 mt-3 text-sm sm:text-base">
                {episodes.find(
                (ep) =>
                  ep.episode_number === Number(episodeNumber) &&
                  selectedSeason === Number(seasonNumber)
                )?.overview || "No description available for this episode."}
              </h1>
              )}
                <div className="flex gap-4 mt-4">
                <button
                  onClick={() => {
                  if (Number(episodeNumber) > 1) {
                    router.push(
                    `/tv/${tvshow.id}/${tvshow.name}/season/${selectedSeason}/episode/${Number(episodeNumber) - 1}`
                    );
                  } else if (selectedSeason > Math.min(...seasonKeys)) {
                    const prevSeason = selectedSeason - 1;
                    const prevSeasonEpisodes = episodes.filter(
                    (ep) => ep.season_number === prevSeason
                    );
                    const lastEpisodeNumber =
                    prevSeasonEpisodes[prevSeasonEpisodes.length - 1]
                      ?.episode_number || 1;
                    router.push(
                    `/tv/${tvshow.id}/${tvshow.name}/season/${prevSeason}/episode/${lastEpisodeNumber}`
                    );
                  }
                  }}
                  disabled={
                  Number(episodeNumber) === 1 &&
                  selectedSeason === Math.min(...seasonKeys)
                  }
                  className={`px-4 py-2 rounded ${
                  Number(episodeNumber) === 1 &&
                  selectedSeason === Math.min(...seasonKeys)
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-yellow-400 cursor-pointer text-gray-800"
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                  if (
                    Number(episodeNumber) <
                    episodes[episodes.length - 1]?.episode_number
                  ) {
                    router.push(
                    `/tv/${tvshow.id}/${tvshow.name}/season/${selectedSeason}/episode/${Number(episodeNumber) + 1}`
                    );
                  } else if (selectedSeason < Math.max(...seasonKeys)) {
                    const nextSeason = selectedSeason + 1;
                    router.push(
                    `/tv/${tvshow.id}/${tvshow.name}/season/${nextSeason}/episode/1`
                    );
                  }
                  }}
                  disabled={
                  Number(episodeNumber) ===
                    episodes[episodes.length - 1]?.episode_number &&
                  selectedSeason === Math.max(...seasonKeys)
                  }
                  className={`px-4 py-2 rounded ${
                  Number(episodeNumber) ===
                    episodes[episodes.length - 1]?.episode_number &&
                  selectedSeason === Math.max(...seasonKeys)
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-yellow-400 cursor-pointer text-gray-800"
                  }`}
                >
                  Next
                </button>
                </div>
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
                className={`bg-gray-900 rounded-lg cursor-pointer transition-transform transform hover:scale-105 hover:bg-yellow-700 overflow-hidden shadow ${
                  episode.episode_number === Number(episodeNumber) &&
                  selectedSeason === Number(seasonNumber)
                    ? "border-2 border-yellow-400"
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
                  <div
                    className="font-semibold text-white text-xs sm:text-sm truncate"
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
        {/* RECOMMENDED TV SHOWS */}
        <div className="mt-8 h-fit gap-4">
          <h1 className="text-lg sm:text-xl font-bold text-yellow-400 mb-4">
            Recommended TV Shows
          </h1>
          <div className="grid lg:grid-cols-8 md:grid-cols-5 sm:grid-cols-4 grid-cols-3 gap-3">
           {recommendedTvshows && recommendedTvshows.length > 0 &&
             recommendedTvshows.map((show) => (
              <div className="overflow-hidden" key={show.id}>
                <MovieCard
                  movie={{
                    id: show.id,
                    title: show.name,
                    vote_average: show.vote_average,
                    poster_path: show.poster_path,
                    release_date: show.first_air_date,
                    first_air_date: show.first_air_date,
                    genre_ids: show.genres?.map((g) => g.id) || [],
                    genres: show.genres?.map((g) => g.name) || [],
                    media_type: "tv",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
