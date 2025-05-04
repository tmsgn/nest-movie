import TVPageContent from "./TVPageContent";

type Tvshow = {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  overview: string;
  seasons: { id: number; season_number: number }[];
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

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

function slugify(title: string): string {
  return encodeURIComponent(
    title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")
  );
}

async function getTvshowDetails(title: string): Promise<Tvshow | null> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${title}`
    );
    if (!res.ok) throw new Error("Failed to search TV show.");
    const data = await res.json();
    const result = data.results?.[0];
    if (!result) return null;

    return {
      id: result.id,
      title: result.title,
      name: result.name,
      poster_path: result.poster_path,
      release_date: result.release_date,
      first_air_date: result.first_air_date,
      vote_average: result.vote_average,
      overview: result.overview ?? "",
      seasons: [], // will be filled from detail endpoint
      origin_country: result.origin_country ?? [],
      genres: [], // will be filled from detail endpoint
    };
  } catch (err) {
    console.error("Error fetching TV show:", err);
    return null;
  }
}

async function getTvshowCast(tvshowId: number): Promise<CastMember[]> {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/tv/${tvshowId}/credits?api_key=${API_KEY}`
    );
    if (!res.ok) throw new Error("Failed to fetch cast.");
    const data = await res.json();
    return data.cast.map((member: any) => ({
      name: member.name,
      character: member.character,
      profile_path: member.profile_path,
    }));
  } catch (err) {
    console.error("Error fetching cast:", err);
    return [];
  }
}

async function getEpisodesBySeason(
  tvshowId: number,
  seasons: { id: number; season_number: number }[]
): Promise<{ [seasonNumber: number]: Episode[] }> {
  const episodesBySeason: { [seasonNumber: number]: Episode[] } = {};

  await Promise.all(
    seasons.map(async (season) => {
      if (season.season_number === 0) return;
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/tv/${tvshowId}/season/${season.season_number}?api_key=${API_KEY}`
        );
        if (!res.ok)
          throw new Error(`Failed to fetch season ${season.season_number}`);
        const data = await res.json();
        episodesBySeason[season.season_number] = data.episodes.map(
          (episode: any) => ({
            season_number: episode.season_number,
            episode_number: episode.episode_number,
            name: episode.name,
            overview: episode.overview,
            still_path: episode.still_path,
          })
        );
      } catch (err) {
        console.error(`Error fetching season ${season.season_number}:`, err);
        episodesBySeason[season.season_number] = [];
      }
    })
  );

  return episodesBySeason;
}

export default async function TVpage({
  params,
}: {
  params: { tvname: string };
}) {
  const decodedTitle = decodeURIComponent(params.tvname.replace(/-/g, " "));
  const tvshow = await getTvshowDetails(decodedTitle);

  if (!tvshow) {
    return <div className="p-4 text-center">Error: TV show not found.</div>;
  }

  // fetch tvshow detail, credits, videos in parallel
  const [tvshowDetail, cast, videoData] = await Promise.all([
    fetch(
      `https://api.themoviedb.org/3/tv/${tvshow.id}?api_key=${API_KEY}`
    ).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch TV show detail.");
      return res.json();
    }),
    getTvshowCast(tvshow.id),
    fetch(
      `https://api.themoviedb.org/3/tv/${tvshow.id}/videos?api_key=${API_KEY}`
    ).then((res) => res.json()),
  ]);

  const genres = Array.isArray(tvshowDetail.genres)
    ? tvshowDetail.genres.map((g: { id: number; name: string }) => ({
        id: g.id,
        name: g.name,
      }))
    : [];
  const seasons = tvshowDetail.seasons || [];

  const episodesBySeason = await getEpisodesBySeason(tvshow.id, seasons);

  const trailer = videoData.results?.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube"
  );

  const slug = tvshow.name ? slugify(tvshow.name) : "detail";

  return (
    <TVPageContent
      tvshow={{ ...tvshow, genres, seasons }}
      tvshowDetail={tvshowDetail}
      episodesBySeason={episodesBySeason}
      cast={cast}
      trailer={trailer}
    />
  );
}
