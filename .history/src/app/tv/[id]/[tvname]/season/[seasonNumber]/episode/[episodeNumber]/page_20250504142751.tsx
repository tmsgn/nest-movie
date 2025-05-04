"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getTvshowDetail } from "@/lib/fetchMovies";

export default function EpisodePage() {
  const params = useParams();
  const { id, seasonNumber, episodeNumber } = params as Record<string, string>;

  const [tvshow, setTvshow] = useState<any>(null);

  useEffect(() => {
    async function fetchTvshow() {
      if (id) {
        const data = await getTvshowDetail(Number(id));
        setTvshow(data);
      }
    }
    fetchTvshow();
  }, [id]);

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <div className="w-full h-3/4 flex ">
        <iframe
          src={`https://vidfast.pro/tv/${id}/${seasonNumber}/${episodeNumber}`}
          className="w-2/3 h-full rounded-lg shadow-md"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation"
        ></iframe>
        <div className="h-fit  flex  mx-2">
          {tvshow && (
            <Image
            className="rounded-lg"
              src={`https://image.tmdb.org/t/p/w500${tvshow.poster_path}`}
              alt={tvshow.name || "Episode Image"}
              width={200}
              height={300}
            />
          )}
          <h1 className="mx-4 text-2xl font-bold line-clamp-2">{tvshow.name}</h1>
          "use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getTvshowDetail } from "@/lib/fetchMovies";

export default function EpisodePage() {
  const params = useParams();
  const { id, seasonNumber, episodeNumber } = params as Record<string, string>;

  const [tvshow, setTvshow] = useState<any>(null);

  useEffect(() => {
    async function fetchTvshow() {
      if (id) {
        const data = await getTvshowDetail(Number(id));
        setTvshow(data);
      }
    }
    fetchTvshow();
  }, [id]);

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <div className="w-full h-3/4 flex">
        <iframe
          src={`https://vidfast.pro/tv/${id}/${seasonNumber}/${episodeNumber}`}
          className="w-2/3 h-full rounded-lg shadow-md"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation"
        ></iframe>
        <div className="h-fit flex mx-2">
          {tvshow && (
            <Image
              className="rounded-lg"
              src={`https://image.tmdb.org/t/p/w500${tvshow.poster_path}`}
              alt={tvshow.name || "Episode Image"}
              width={200}
              height={300}
            />
          )}
          <div className="ml-4">
            <h1 className="text-2xl font-bold line-clamp-2">{tvshow?.name}</h1>

            {tvshow && (
              <>
                <p className="text-gray-600 text-sm mt-2">{tvshow.overview}</p>
                <p className="mt-2 text-sm text-gray-500">
                  <strong>First Air Date:</strong> {tvshow.first_air_date}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Seasons:</strong> {tvshow.number_of_seasons} | <strong>Episodes:</strong> {tvshow.number_of_episodes}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Genres:</strong>{" "}
                  {tvshow.genres.map((g: { name: string }) => g.name).join(", ")}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Rating:</strong> {tvshow.vote_average.toFixed(1)} / 10
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

          
        </div>
      </div>
    </div>
  );
}
