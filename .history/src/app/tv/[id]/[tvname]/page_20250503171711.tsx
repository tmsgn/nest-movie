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

const slugify = (title: string): string =>
  encodeURIComponent(
    title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
  );

const fetchJson = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
  return res.json();
};

const getTvshowDetails = async (title: string): Promise<Tvshow | null> => {
  try {
    const data = await fetchJson(
      `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${title}`
    );
    console.log("API Response for TV show search:", data); 
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
      seasons: [],
      origin_country: result.origin_country ?? [],
      genres: [],
    };
  } catch (err) {
    console.error("Error fetching TV show:", err);
    return null;
  }
};
const getTvshowCast = async (tvshowId: number): Promise<CastMember[]> => {
  try {
    const data = await fetchJson(
      `https://api.themoviedb.org/3/tv/${tvshowId}/credits?api_key=${API_KEY}`
    );
    return data.cast.map((member: any) => ({
      name: member.name,
      character: member.character,
      profile_path: member.profile_path,
    }));
  } catch (err) {
    console.error("Error fetching cast:", err);
    return [];
  }
};

const getEpisodesBySeason = async (
  tvshowId: number,
  seasons: { id: number; season_number: number }[]
): Promise<{ [seasonNumber: number]: Episode[] }> => {
  const episodesBySeason: { [seasonNumber: number]: Episode[] } = {};

  await Promise.all(
    seasons.map(async (season) => {
      if (season.season_number === 0) return;
      try {
        const data = await fetchJson(
          `https://api.themoviedb.org/3/tv/${tvshowId}/season/${season.season_number}?api_key=${API_KEY}`
        );
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
};

export default async function TVpage({
  params,
}: {
  params: { tvname: string; id: string };
}) {
  const tvshowId = params.id;

  try {
    const [tvshowDetail, cast, videoData] = await Promise.all([
      fetchJson(
        `https://api.themoviedb.org/3/tv/${tvshowId}?api_key=${API_KEY}`
      ),
      getTvshowCast(parseInt(tvshowId)),
      fetchJson(
        `https://api.themoviedb.org/3/tv/${tvshowId}/videos?api_key=${API_KEY}`
      ),
    ]);

    const genres =
      tvshowDetail.genres?.map((g: { id: number; name: string }) => ({
        id: g.id,
        name: g.name,
      })) || [];
    const seasons = tvshowDetail.seasons || [];
    const episodesBySeason = await getEpisodesBySeason(
      parseInt(tvshowId),
      seasons
    );

    const trailer = videoData.results?.find(
      (video: any) => video.type === "Trailer" && video.site === "YouTube"
    );

    return (
      <TVPageContent
        tvshow={{ ...tvshowDetail, genres, seasons }}
        tvshowDetail={tvshowDetail}
        episodesBySeason={episodesBySeason}
        cast={cast}
        trailer={trailer}
      />
    );
  } catch (err) {
    console.error("Error fetching TV show data:", err);
    return (
      <div className="p-4 text-center">Error: Failed to load TV show data.</div>
    );
  }
}
