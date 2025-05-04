"use client";

import { useParams } from "next/navigation";
import Image from "next/image";

export default function EpisodePage() {
  const params = useParams();
  const { tvname, id, seasonNumber, episodeNumber } = params;

  const getTvshowDetail = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}/episode/${episodeNumber}?api_key=YOUR_API_KEY`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch episode details");
      }
      const data = await response.json();
      const tvshowData= data;
      return data;
    } catch (error) {
      console.error("Error fetching episode details:", error);
      return null;
    }
  };

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <div className="w-full h-3/4 flex ">
        <iframe
          src={`https://vidfast.pro/tv/${id}/${seasonNumber}/${episodeNumber}`}
          className="w-2/3 h-full rounded-lg shadow-md"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation"
        ></iframe>
        <div className=" h-full flex-1 mx-2">
          {/*tv show detail*/}

          <Image
            src={`https://image.tmdb.org/t/p/w300${tvsh}`} alt={""}          />

        </div>
      </div>
    </div>
  );
}
