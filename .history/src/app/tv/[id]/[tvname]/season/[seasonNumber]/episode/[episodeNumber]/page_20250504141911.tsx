"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import 

export default function EpisodePage() {
  const params = useParams();
  const { tvname, id, seasonNumber, episodeNumber } = params;

  const [episodeDetails, setEpisodeDetails] = useState<any>(null);

  const getTvshow = async () => {
    
  }

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <div className="w-full h-3/4 flex ">
        <iframe
          src={`https://vidfast.pro/tv/${id}/${seasonNumber}/${episodeNumber}`}
          className="w-2/3 h-full rounded-lg shadow-md"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation"
        ></iframe>
        <div className="h-full flex-1 mx-2">
          {episodeDetails && (
            <Image
            src={`https://image.tmdb.org/t/p/w500${tvshow.poster_path}`}
              alt={episodeDetails.name || "Episode Image"}
              
              width={300}
              height={450}
            />
          )}
        </div>
      </div>
    </div>
  );
}
