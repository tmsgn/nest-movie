"use client";

import { useParams } from "next/navigation";

export default function EpisodePage() {
  const params = useParams();
  const { tvname,id, seasonNumber, episodeNumber } = params;

  return (
    <div>
      <h1>Watching {tvname}</h1>
      <p>Season: {seasonNumber}</p>
      <p>Episode: {episodeNumber}</p>
      <h1>{id}</h1>
      <div className="relative pb-[56.25%] h-0 overflow-hidden mb-8">
          <iframe
            src={`https://vidfast.pro/tv/${id}/${}/`}
            className="w-full h-[500px] rounded-lg shadow-md"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
          ></iframe>
        </div>

    </div>
  );
}
