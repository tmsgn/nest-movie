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
    </div>
  );
}
