"use client";

import { useParams } from "next/navigation";

export default function EpisodePage() {
  const params = useParams();
  const { tvname, id, seasonNumber, episodeNumber } = params;

  return (
    <div className="w-screen h-screen overflow-x">
      <div>
        <iframe
          src={`https://vidfast.pro/tv/${id}/${seasonNumber}/${episodeNumber}`}
          className="w-full h-[500px] rounded-lg shadow-md"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation"
        ></iframe>
      </div>
    </div>
  );
}
