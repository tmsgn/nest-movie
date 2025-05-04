export default async function TVpage({ params }: { params: { tvname: string } }) {
  const decodedTitle = decodeURIComponent(params.tvname.replace(/-/g, " "));
  const tvshow = await getTvshowDetails(decodedTitle);

  if (!tvshow) {
    return <div className="p-4 text-center">Error: TV show not found.</div>;
  }

  // Fetch tvshow detail, credits, videos in parallel
  const [tvshowDetail, cast, videoData] = await Promise.all([
    fetch(`https://api.themoviedb.org/3/tv/${tvshow.id}?api_key=${API_KEY}`).then((res) => {
      if (!res.ok) throw new Error("Failed to fetch TV show detail.");
      return res.json();
    }),
    getTvshowCast(tvshow.id),
    fetch(`https://api.themoviedb.org/3/tv/${tvshow.id}/videos?api_key=${API_KEY}`).then((res) => res.json()),
  ]);

  const genres = Array.isArray(tvshowDetail.genres)
    ? tvshowDetail.genres.map((g: { id: number; name: string }) => ({ id: g.id, name: g.name }))
    : [];
  const seasons = tvshowDetail.seasons || [];

  const episodesBySeason = await getEpisodesBySeason(tvshow.id, seasons);

  const trailer = videoData.results?.find((video: any) => video.type === "Trailer" && video.site === "YouTube");

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
