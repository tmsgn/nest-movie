"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getTvshowDetail } from "@/lib/fetchMovies";

export default function EpisodePage() {
  const params = useParams();
  const { id, seasonNumber, episodeNumber } = params as Record<string, string>;

  const [tvshow, setTvshow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTvshow() {
      if (id) {
        setLoading(true);
        const data = await getTvshowDetail(Number(id));
        setTvshow(data);
        setLoading(false);
      }
    }
    fetchTvshow();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      {/* Your existing content */}
    </div>
  );
}
