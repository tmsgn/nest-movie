// app/tvpage/page.tsx
import TVPageContent from "./TVPageContent";

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
      episodesBySeason[season.season_number] = seasonEpisodesData.episodes || [];
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
  // Extract the title and ID from the URL
  const [titlePart, idPart] = params.tvname.split("-");
  const tvshowId = parseInt(idPart, 10);

  if (isNaN(tvshowId)) {
    return <div className="p-4 text-center">Error: Invalid TV show ID.</div>;
  }

  // Fetch TV show details using the ID
  const tvshowDetail = await fetch(
    `https://api.themoviedb.org/3/tv/${tvshowId}?api_key=${API_KEY}`
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
    tvshowId,
    tvshowDetail.seasons || []
  );
  const cast = await getTvshowCast(tvshowId);
  const videoRes = await fetch(
    `https://api.themoviedb.org/3/tv/${tvshowId}/videos?api_key=${API_KEY}`
  );
  const videoData = await videoRes.json();
  const trailer = videoData.results.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube"
  );

  return (
    <TVPageContent
      tvshow={tvshowDetail}
      tvshowDetail={tvshowDetail}
      episodesBySeason={episodesBySeason}
      cast={cast}
      trailer={trailer}
    />
  );
}