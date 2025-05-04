"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";

interface Episode {
  id: string;
  title: string;
  thumbnail: string;
}

interface Season {
  number: number;
  episodes: Episode[];
}

const mockSeasons: Season[] = [
  {
    number: 1,
    episodes: [
      { id: "1", title: "Rose", thumbnail: "/episodes/s1e1.jpg" },
      { id: "2", title: "The End of the World", thumbnail: "/episodes/s1e2.jpg" },
      { id: "3", title: "The Unquiet Dead", thumbnail: "/episodes/s1e3.jpg" },
   
    ]
  },
  // Add more seasons
];

export default function EpisodePage() {
  const params = useParams();
  const router = useRouter();
  const { tvname, id, seasonNumber, episodeNumber } = params;
  const [selectedSeason, setSelectedSeason] = useState(Number(seasonNumber));

  const handleSeasonChange = (season: number) => {
    setSelectedSeason(season);
    router.push(`/tv/${id}/${tvname}/season/${season}/episode/1`);
  };

  const handleEpisodeClick = (episodeNum: string) => {
    router.push(`/tv/${id}/${tvname}/season/${selectedSeason}/episode/${episodeNum}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Video Player Section */}
      <div className="max-w-6xl mx-auto">
        <div className="relative pb-[56.25%] h-0 overflow-hidden mb-8 rounded-lg">
          <iframe
            src={`https://vidfast.pro/tv/${id}/${seasonNumber}/${episodeNumber}`}
            className="absolute top-0 left-0 w-full h-full"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-presentation"
          />
        </div>

        {/* Episode Info */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{tvname}</h1>
          <div className="flex items-center gap-4 text-gray-300">
            <p>Season {seasonNumber}</p>
            <p>Episode {episodeNumber}</p>
          </div>
        </div>

        {/* Season Selection */}
        <div className="mb-6">
          <select 
            value={selectedSeason}
            onChange={(e) => handleSeasonChange(Number(e.target.value))}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg"
          >
            {mockSeasons.map((season) => (
              <option key={season.number} value={season.number}>
                Season {season.number}
              </option>
            ))}
          </select>
        </div>

        {/* Episodes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockSeasons[selectedSeason - 1]?.episodes.map((episode) => (
            <div
              key={episode.id}
              onClick={() => handleEpisodeClick(episode.id)}
              className="cursor-pointer group"
            >
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={episode.thumbnail}
                  alt={episode.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white">Play Episode</span>
                </div>
              </div>
              <h3 className="mt-2 text-sm font-medium">{episode.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
