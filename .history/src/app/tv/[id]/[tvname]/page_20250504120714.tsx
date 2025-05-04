// tv/[id]/page.tsx

import TVPageContent from "./TVPageContent";

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

const fetchJson = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
  return res.json();
};

const getTvshowCast = async (tvshowId: number): Promise<CastMember[]> => {
  try {
    const data = await fetchJson(
      `https://api.themoviedb.org/3/tv/${tvshowId}/credits?api_key=${API_KEY}`
    );
    return data.cast.map((m: any) => ({
      name: m.name,
      character: m.character,
      profile_path: m.profile_path,
    }));
  } catch {
    return [];
  }
};

const getEpisodesBySeason = async (
  tvshowId: number,
  seasons: { season_number: number }[]
): Promise<Record<number, Episode[]>> => {
  const episodesBySeason: Record<number, Episode[]> = {};
  await Promise.all(
    seasons
      .filter((s) => s.season_number > 0)
      .map(async (season) => {
        try {
          const data = await fetchJson(
            `https://api.themoviedb.org/3/tv/${tvshowId}/season/${season.season_number}?api_key=${API_KEY}`
          );
          episodesBySeason[season.season_number] = data.episodes.map((ep: any) => ({
            season_number: ep.season_number,
            episode_number: ep.episode_number,
            name: ep.name,
            overview: ep.overview,
            still_path: ep.still_path,
          }));
        } catch {
          episodesBySeason[season.season_number] = [];
        }
      })
  );
  return episodesBySeason;
};

export async function generateStaticParams() {
  const data = await fetchJson(
    `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`
  );
  return data.results.slice(0, 10).map((tv: any) => ({ id: tv.id.toString() }));
}

export default async function TVpage({ params }: { params: { id: string } }) {
  const tvshowId = params.id;
  try {
    const [tvshowDetail, cast, videoData] = await Promise.all([
      fetchJson(`https://api.themoviedb.org/3/tv/${tvshowId}?api_key=${API_KEY}`),
      getTvshowCast(Number(tvshowId)),
      fetchJson(`https://api.themoviedb.org/3/tv/${tvshowId}/videos?api_key=${API_KEY}`),
    ]);
    const genres = tvshowDetail.genres ?? [];
    const seasons = tvshowDetail.seasons ?? [];
    const episodesBySeason = await getEpisodesBySeason(Number(tvshowId), seasons);
    const trailer = videoData.results?.find(
      (v: any) => v.type === "Trailer" && v.site === "YouTube"
    );
    return (
      <TVPageContent
        tvshow={{ ...tvshowDetail, genres, seasons }}
        episodesBySeason={episodesBySeason}
        cast={cast}
        trailer={trailer} tvshowDetail={undefined}      />
    );
  } catch {
    return <div className="p-4 text-center">Error: Failed to load TV show data.</div>;
  }
}
