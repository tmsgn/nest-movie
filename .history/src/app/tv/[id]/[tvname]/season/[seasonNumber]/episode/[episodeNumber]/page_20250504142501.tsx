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
        <div className="h-full flex h mx-2">
          {tvshow && (
            <Image
            className="rounded-lg"
              src={`https://image.tmdb.org/t/p/w500${tvshow.poster_path}`}
              alt={tvshow.name || "Episode Image"}
              width={200}
              height={300}
            />
          )}
          <h1>{tvshow.name}</h1>
        </div>
      </div>
    </div>
  );
}
