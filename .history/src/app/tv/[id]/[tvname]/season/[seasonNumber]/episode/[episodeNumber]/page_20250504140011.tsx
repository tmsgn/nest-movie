"use client";

import { useParams } from "next/navigation";

export default function EpisodePage() {
  const params = useParams();
  const { tvname, id, seasonNumber, episodeNumber } = params;

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <div className="w-full h-3/4 flex ">
        <iframe
          src={`https://vidfast.pro/tv/${id}/${seasonNumber}/${episodeNumber}`}
          className="w-2/3 h-full rounded-lg shadow-md"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation"
        ></iframe>
        <div className="bg-red-500 h-full flex-1 mx-">
          {/*tv show detail*/}

        </div>
      </div>
    </div>
  );
}
