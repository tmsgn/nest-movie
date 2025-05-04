"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getTvshowDetail } from "@/lib/fetchMovies";

export default function EpisodePage() {
  const params = useParams();
  const { id, seasonNumber, episodeNumber } = params as Record<string, string>;

  const [tvshow, setTvshow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTvshow() {
      if (id) {
        setLoading(true);
        const data = await getTvshowDetail(Number(id));
        setTvshow(data);
        setLoading(false);
      }
    }
    fetchTvshow();
  }, [id]);

  if (loading) {
    return (
      <div className="w-screen h-screen overflow-x-hidden">
        <div className="w-full h-3/4 flex">
          <div className="w-2/3 h-full bg-gray-800 rounded-lg shadow-md animate-pulse"></div>
          <div className="flex flex-col w-1/3 min-h-full mr-7 ml-2">
            <div className="flex">
              <div className="w-[200px] h-[300px] bg-gray-800 rounded-lg animate-pulse"></div>
              <div className="ml-4 flex flex-col justify-start">
                <div className="h-8 bg-gray-600 rounded w-3/4 animate-pulse"></div>
                <div className="mt-2 h-6 bg-yellow-400 w-1/4 rounded-sm animate-pulse"></div>
                <div className="mt-3 space-y-2">
                  <div className="h-5 bg-gray-600 rounded w-1/2 animate-pulse"></div>
                  <div className="h-5 bg-gray-600 rounded w-1/3 animate-pulse"></div>
                  <div className="h-5 bg-gray-600 rounded w-1/4 animate-pulse"></div>
                  <div className="h-5 bg-gray-600 rounded w-1/2 animate-pulse"></div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="h-6 bg-yellow-400 rounded px-4 py-2 animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="mt-4 h-6 bg-yellow-400 w-1/4 rounded animate-pulse"></div>
              <div className="mt-3 space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-4 bg-gray-600 rounded w-full animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ regular content after loading
  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <div className="w-full h-3/4 flex">
        <iframe
          src={`https://vidfast.pro/tv/${id}/${seasonNumber}/${episodeNumber}`}
          className="w-2/3 h-full rounded-lg shadow-md"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation"
        ></iframe>
        <div className="flex flex-col w-1/3 min-h-full mr-7 ml-2">
          <div className="flex">
            {tvshow && (
              <>
                <Image
                  className="rounded-lg h-fit"
                  src={`https://image.tmdb.org/t/p/w500${tvshow.poster_path}`}
                  alt={tvshow.name || "Episode Image"}
                  width={200}
                  height={300}
                />
                <div className="ml-4 flex flex-col justify-start">
                  <h1 className="text-2xl font-bold line-clamp-2">
                    {tvshow.name}
                  </h1>
                  <h1 className="mt-2 bg-yellow-400 w-fit p-0.5 rounded-sm text-gray-700">
                    S{seasonNumber}-E{episodeNumber}
                  </h1>
                  <div className="mt-3 text-gray-300">
                    <span className="flex gap-2">
                      <h1>Release date:</h1>
                      <h1>
                        {new Date(tvshow.first_air_date).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "long", day: "numeric" }
                        )}
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
                        {tvshow.vote_average.toFixed(1)} / 10 (
                        {tvshow.vote_count} votes)
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
              </>
            )}
          </div>
          <div>
            <h1 className="mt-4 text-lg font-bold text-yellow-400">
              Description:
            </h1>
            {tvshow && tvshow.overview && (
              <h1 className="line-clamp-9 mt-3">{tvshow.overview}</h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
