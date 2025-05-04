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
  try {
    // First try to get the show details by searching
    const tvTitle = params.tvname.replace(/-/g, ' ');
    const searchResult = await getTvshowDetails(tvTitle);
    
    if (!searchResult) {
      return <div className="p-4 text-center">Error: TV show not found</div>;
    }

    const tvshowId = searchResult.id;
    
    // Fetch detailed information using the found ID
    const tvshowDetail = await fetch(
      `https://api.themoviedb.org/3/tv/${tvshowId}?api_key=${API_KEY}`
    ).then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch TV show');
      }
      return res.json();
    });

    if (!tvshowDetail) {
      return <div className="p-4 text-center">Error: TV show not found</div>;
    }

    const episodesBySeason = await getEpisodesBySeason(
      parseInt(tvshowId),
      tvshowDetail.seasons || []
    );
    const cast = await getTvshowCast(parseInt(tvshowId));
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
  } catch (error) {
    console.error('Error loading TV show:', error);
    return (
      <div className="p-4 text-center">
        Error: Unable to load TV show details
      </div>
    );
  }
}
