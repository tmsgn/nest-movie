"use client";

import { useParams } from "next/navigation";

export default function EpisodePage() {
  const params = useParams();
  const { tvname,id, seasonNumber, episodeNumber } = params;

  return (
    <div>
      <div>
        <iframe src="" frameborder="0"></iframe>
      </div>
    </div>
  );
}
