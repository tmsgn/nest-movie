"use client";

import { useParams } from "next/navigation";

export default function EpisodePage() {
  const params = useParams();
  const { tvname, id, seasonNumber, episodeNumber } = params;

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <div className="w-full h-3/4 bg-amber-400">
      
      </div>
    </div>
  );
}
