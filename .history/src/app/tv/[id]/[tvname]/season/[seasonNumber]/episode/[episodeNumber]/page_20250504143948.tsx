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
          <div className="flex w-1/3 min-h-full mr-7 ml-2">
            div
          </div>
          sddds
        </div>
      </div>
  );
}
