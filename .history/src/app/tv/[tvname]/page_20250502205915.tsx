
import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";

async function getYoutubeTrailer(tvshowName: string) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
      tvshowName + " trailer"
    )}&key=YOUR_YOUTUBE_API_KEY&type=video`
  );
  const data = await response.json();
  return data.items?.[0]?.id?.videoId || null;
}

export default function Page({ tvshow }: { tvshow: any }) {
  const [trailerId, setTrailerId] = useState<string | null>(null);

  useEffect(() => {
    if (tvshow?.name) {
      getYoutubeTrailer(tvshow.name).then((id) => setTrailerId(id));
    }
  }, [tvshow?.name]);

  return (
    <div>
      <div>
        <div>
          <h1 className="text-4xl font-bold">{tvshow.name}</h1>
          <div>
            {tvshow.overview && <p>{tvshow.overview}</p>}
            {tvshow.first_air_date && (
              <h1 className="mt-2">
                Release Date: {new Date(tvshow.first_air_date).toLocaleDateString()}
              </h1>
            )}
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-yellow-400 m-3">Trailer</h1>
        {trailerId ? (
          <YouTube videoId={trailerId} opts={{ width: "100%", height: "390" }} />
        ) : (
          <p className="text-gray-500">Trailer not available</p>
        )}
      </div>
    </div>
  );
}