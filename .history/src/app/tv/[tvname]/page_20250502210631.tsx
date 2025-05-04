import Image from "next/image";
import {get}
export default async function TVpage({
  params: paramsPromise,
}: {
  params: Promise<{ tvname: string }>;
}) {
  const params = await paramsPromise;
  const title = params.tvname.replace(/-/g, " ");
  const tvshow = await getTvshowDetails(title);

  const tvshowDetail = await (
    await fetch(
      `https://api.themoviedb.org/3/tv/${tvshow.id}?api_key=${API_KEY}`
    )
  ).json();

  const episodesBySeason = await getEpisodesBySeason(
    tvshow.id,
    tvshowDetail.seasons
  );
  const cast = await getTvshowCast(tvshow.id);

  return (
    <div>
      <div className="w-screen flex sm:flex-row flex-col">
        <div className="w-fit ">
          <Image
            src={`https://image.tmdb.org/t/p/w500${tvshow?.poster_path}`}
            alt={tvshow?.title || "TV show poster"}
            width={500}
            height={750}
            className="object-cover max-w-72 h-96 rounded-lg"
          />
        </div>
        <div className="mx-4 text-ellipsis">
          <h1 className="text-3xl font-bold ">{tvshow?.name}</h1>
          <div className="flex justify-around">
            <h1 className="text-sm font-medium text-gray-400">
              {new Date(tvshow?.first_air_date || "").getFullYear()}
            </h1>
            {tvshow?.vote_average && (
              <h1 className="">{tvshow?.vote_average.toFixed(1)}⭐</h1>
            )}
            <h1 className="bg-yellow-500 text-gray-700 font-medium p-[2px] rounded text-sm shadow-md">
              HD
            </h1>
          </div>
          <div>
            <h1>{tvshow?.overview}</h1>
            <h1 className="text-sm font-medium text-gray-400 mt-2">
              {tvshow?.genres && tvshow.genres.length > 0
                ? tvshow.genres.map((genre) => genre.name).join(", ")
                : "No genres available"}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
