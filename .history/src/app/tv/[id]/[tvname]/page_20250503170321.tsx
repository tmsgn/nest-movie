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
  genres: string[]; // Array of genre names
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

async function getTvshowDetails(title: string): Promise<Tvshow | null> {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${title}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch TV show details.");
    }
    const data = await response.json();
    return data.results?.[0] as Tvshow;
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    return null;
  }
}

async function getTvshowCast(tvshowId: number): Promise<CastMember[]> {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${tvshowId}/credits?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch TV show cast.");
    }
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
): Promise<{ [seasonNumber: number]: Episode[] }> {
  const episodesBySeason: { [seasonNumber: number]: Episode[] } = {};
  for (const season of seasons) {
    if (season.season_number === 0) continue;
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${tvshowId}/season/${season.season_number}?api_key=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch episodes for season ${season.season_number}.`
        );
      }
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
  const title = decodeURIComponent(params.tvname.replace(/-/g, " "));
  const tvshow = await getTvshowDetails(title);

  if (!tvshow) {
    return <div className="p-4 text-center">Error: TV show not found.</div>;
  }

  const tvshowDetail = await fetch(
    `https://api.themoviedb.org/3/tv/${tvshow.id}?api_key=${API_KEY}`
  )
    .then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch TV show details.");
      }
      return res.json();
    })
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
  const trailer = videoData.results?.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube"
  );

  const slug = tvshow.name
    ? encodeURIComponent(
        tvshow.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")
      )
    : "detail";

  const genres =
    Array.isArray(tvshow.genres) && typeof tvshow.genres[0] === "object"
      ? (tvshow.genres as unknown as { name: string }[]).map((genre) => genre.name)
      : Array.isArray(tvshow.genres)
      ? tvshow.genres
      : [];

  return (
    <TVPageContent
      tvshow={{
        ...tvshow,
        genres, // Include genres in the TV show object
      }}
      tvshowDetail={tvshowDetail}
      episodesBySeason={episodesBySeason}
      cast={cast}
      trailer={trailer}
      slug={slug}
    />
  );
}