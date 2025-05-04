// /tv/[id]/[tvname]/page.tsx

import TVPageContent from "./TVPageContent";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

async function fetchTvDetails(id: string) {
  const [detailsRes, creditsRes, videosRes] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`),
    fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=${API_KEY}`),
    fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${API_KEY}`),
  ]);

  if (!detailsRes.ok) throw new Error("TV details fetch failed.");
  if (!creditsRes.ok) throw new Error("TV credits fetch failed.");
  if (!videosRes.ok) throw new Error("TV videos fetch failed.");

  const [details, credits, videos] = await Promise.all([
    detailsRes.json(),
    creditsRes.json(),
    videosRes.json(),
  ]);

  return { details, credits, videos };
}

async function fetchEpisodes(id: string, seasons: { season_number: number }[]) {
  const episodesBySeason: Record<number, any[]> = {};

  await Promise.all(
    seasons.map(async (season) => {
      if (season.season_number === 0) return;
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/${id}/season/${season.season_number}?api_key=${API_KEY}`
      );
      if (!res.ok) return;
      const seasonData = await res.json();
      episodesBySeason[season.season_number] = seasonData.episodes || [];
    })
  );

  return episodesBySeason;
}

export default async function TVPage({
  params,
}: {
  params: { id: string; tvname: string };
}) {
  const { id } = params;

  try {
    const { details, credits, videos } = await fetchTvDetails(id);
    const episodesBySeason = await fetchEpisodes(id, details.seasons);

    const trailer = videos.results.find(
      (v: any) => v.type === "Trailer" && v.site === "YouTube"
    );

    const cast = credits.cast.slice(0, 10).map((c: any) => ({
      name: c.name,
      character: c.character,
      profile_path: c.profile_path,
    }));

    return (
      <TVPageContent
        tvshow={{
          id: details.id,
          name: details.name,
          poster_path: details.poster_path,
          overview: details.overview,
          first_air_date: details.first_air_date,
          vote_average: details.vote_average,
        }}
        tvshowDetail={details}
        episodesBySeason={episodesBySeason}
        cast={cast}
        trailer={trailer}
      />
    );
  } catch (err) {
    console.error(err);
    return (
      <div className="p-4 text-center text-red-500">
        Failed to load TV show. Please try again.
      </div>
    );
  }
}
