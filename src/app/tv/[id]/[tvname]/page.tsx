import TVPageContent from "./TVPageContent";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_KEY!;
const BASE = "https://api.themoviedb.org/3";

async function tmdbFetch(path: string) {
  const res = await fetch(`${BASE}${path}?api_key=${API_KEY}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`TMDB ${path} failed`);
  return res.json();
}

type CastMember = { name: string; character: string; profile_path: string };

async function getTvshowCast(id: number): Promise<CastMember[]> {
  try {
    const data = await tmdbFetch(`/tv/${id}/credits`);
    return (data.cast || []).slice(0, 10).map((m: any) => ({
      name: m.name,
      character: m.character,
      profile_path: m.profile_path,
    }));
  } catch {
    return [];
  }
}

export default async function TVpage({
  params,
}: {
  params: Promise<{ tvname: string; id: string }>;
}) {
  const { id } = await params;

  try {
    // Only fetch season 1 episodes at server time — other seasons load client-side
    const [tvshowDetail, cast, videoData, season1] = await Promise.all([
      tmdbFetch(`/tv/${id}`),
      getTvshowCast(parseInt(id)),
      tmdbFetch(`/tv/${id}/videos`),
      tmdbFetch(`/tv/${id}/season/1`),
    ]);

    const trailer = (videoData.results || []).find(
      (v: any) => v.type === "Trailer" && v.site === "YouTube",
    );

    // Only season 1 is pre-loaded; other seasons are fetched by client on demand
    const episodesBySeason: { [sn: number]: any[] } = {
      1: (season1.episodes || []).map((e: any) => ({
        season_number: e.season_number,
        episode_number: e.episode_number,
        name: e.name,
        overview: e.overview,
        still_path: e.still_path,
      })),
    };

    return (
      <TVPageContent
        tvshow={tvshowDetail}
        tvshowDetail={tvshowDetail}
        episodesBySeason={episodesBySeason}
        cast={cast}
        trailer={trailer}
      />
    );
  } catch {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--clr-bg)",
          color: "#8888a8",
          flexDirection: "column",
          gap: 12,
          paddingTop: 80,
        }}
      >
        <p style={{ fontSize: "1.1rem" }}>Failed to load TV show data.</p>
        <a
          href="/"
          style={{
            color: "#f5c518",
            textDecoration: "underline",
            fontSize: "0.9rem",
          }}
        >
          ← Back to Home
        </a>
      </div>
    );
  }
}
