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
