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
        <div className="flex h-fit mx-2">
          {tvshow && (
            <>
              <Image
                className="rounded-lg"
                src={`https://image.tmdb.org/t/p/w500${tvshow.poster_path}`}
                alt={tvshow.name || "Episode Image"}
                width={200}
                height={300}
              />
              <div className="ml-4 flex flex-col justify-start">
                <h1 className="text-2xl font-bold line-clamp-2">
                  {tvshow.name}
                </h1>
                <h1 className=""></h1>
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
      </div>
    </div>
  );
}
