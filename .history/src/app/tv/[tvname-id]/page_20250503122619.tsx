export default async function TVPage({
  params,
}: {
  params: { tvname: string };
}) {
  // Ensure `tvname` exists before calling replace
  const title = params.tvname ? params.tvname.replace(/-/g, " ") : "";

  if (!title) {
    return <div className="p-4 text-center">Error: TV show not found.</div>;
  }

  const tvshow = await getTvshowDetails(title);

  if (!tvshow) {
    return <div className="p-4 text-center">Error: TV show not found.</div>;
  }

  const tvshowDetail = await fetch(
    `https://api.themoviedb.org/3/tv/${tvshow.id}?api_key=${API_KEY}`
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
    tvshow.id,
    tvshowDetail.seasons || []
  );
  const cast = await getTvshowCast(tvshow.id);
  const videoRes = await fetch(
    `https://api.themoviedb.org/3/tv/${tvshow.id}/videos?api_key=${API_KEY}`
  );
  const videoData = await videoRes.json();
  const trailer = videoData.results.find(
    (video: any) => video.type === "Trailer" && video.site === "YouTube"
  );

  return (
    <TVPageContent
      tvshow={tvshow}
      tvshowDetail={tvshowDetail}
      episodesBySeason={episodesBySeason}
      cast={cast}
      trailer={trailer}
    />
  );
}
