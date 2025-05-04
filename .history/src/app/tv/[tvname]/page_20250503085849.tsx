import React from "react";
import Image from "next/image";

type Tvshow = {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
  name: string;
  seasons: { id: number; season_number: number }[];
  first_air_date: string;
  origin_country: string[];
  genres: { id: number; name: string }[];
};

type CastMember = {
  name: string;
  character: string;
  profile_path: string;
};

type Episode = {
  season_number: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string;
};

const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";

async function getTvshowDetails(title: string) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${title}`
    );
    const data = await response.json();
    return data.results?.[0] as Tvshow;
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    return null;
  }
}

async function getTvshowCast(tvshowId: number) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${tvshowId}/credits?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.cast as CastMember[];
  } catch (error) {
    console.error("Error fetching TV show cast:", error);
    return [];
  }
}

async function getEpisodesBySeason(
  tvshowId: number,
  seasons: { id: number; season_number: number }[]
) {
  const episodesBySeason: { [seasonNumber: number]: Episode[] } = {};
  for (const season of seasons) {
    if (season.season_number === 0) continue;
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${tvshowId}/season/${season.season_number}?api_key=${API_KEY}`
      );
      const seasonEpisodesData = await response.json();
      episodesBySeason[season.season_number] =
        seasonEpisodesData.episodes || [];
    } catch (error) {
      console.error(
        `Error fetching episodes for season ${season.season_number}:`,
        error
      );
      episodesBySeason[season.season_number] = [];
    }
  }
  return episodesBySeason;
}

export default async function TVpage({
  params,
}: {
  params: { tvname: string };
}) {
  const title = params.tvname.replace(/-/g, " ");
  const tvshow = await getTvshowDetails(title);

  if (!tvshow) {
    return <div className="p-4 text-center">Error: TV show not found.</div>;
  }

  const tvshowDetail = await fetch(
    `https://api.themoviedb.org/3/tv/${tvshow.id}?api_key=${API_KEY}`
  )
    .then((res) => res.json())
    .catch((error) => {
      console.error("Error fetching TV show details:", error);
      return null;
    });

  if (!tvshowDetail) {
    return (
      <div className="p-4 text-center">
        Error: Unable to fetch TV show details.
      </div>
    );
  }

  const episodesBySeason = await getEpisodesBySeason(
    tvshow.id,
    tvshowDetail.seasons || []
  );
  const cast = await getTvshowCast(tvshow.id);
  const videoRes = await fetch(
    `https://api.themoviedb.org/3/tv/${tvshow.id}/videos?api_key=${API_KEY}`
  );
  const videoData = await videoRes.json();
  const trailer = videoData.results.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube"
  );

  return (
    <TVPageContent
      tvshow={tvshow}
      tvshowDetail={tvshowDetail}
      episodesBySeason={episodesBySeason}
      cast={cast}
      trailer={trailer}
    />
  );
}

function TVPageContent({
  tvshow,
  tvshowDetail,
  episodesBySeason,
  cast,
  trailer,
}: {
  tvshow: Tvshow;
  tvshowDetail: any;
  episodesBySeason: { [seasonNumber: number]: Episode[] };
  cast: CastMember[];
  trailer: any;
}) {
  return (
    <ClientTVPageContent
      tvshow={tvshow}
      tvshowDetail={tvshowDetail}
      episodesBySeason={episodesBySeason}
      cast={cast}
      trailer={trailer}
    />
  );
}

function ClientTVPageContent({
  tvshow,
  tvshowDetail,
  episodesBySeason,
  cast,
  trailer,
}: {
  tvshow: Tvshow;
  tvshowDetail: any;
  episodesBySeason: { [seasonNumber: number]: Episode[] };
  cast: CastMember[];
  trailer: any;
}) {
  const [selectedSeason, setSelectedSeason] = React.useState(
    Object.keys(episodesBySeason)[0] || "1"
  );
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Main Info Section */}
      {/* ... (rest of the JSX remains the same) */}
    </div>
  );
}
