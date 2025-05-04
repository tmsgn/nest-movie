import Image from "next/image";

type Movie = {
  title: string;
  release_date: string;
  poster_path: string | null;
  genres: string[];
  vote_average: number;
};

type TVShow = {
  name: string;
  first_air_date: string;
  poster_path: string | null;
  genres: string[];
  vote_average: number;
};

type MovieOrTVShow = Movie | TVShow;

export default function MovieCard({ item }: { item: MovieOrTVShow }) {
  const isMovie = "title" in item;

  const title = isMovie ? item.title : item.name;
  const releaseDate = isMovie ? item.release_date : item.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";

  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "/no-poster.png";

  const genre = item.genres[0] || "Unknown";
  const voteAverage =
    item.vote_average !== 0 ? item.vote_average.toFixed(1) : "N/A";

  const mediaType = isMovie ? "movie" : "tv";

  return (
    <Link
      href={`/${mediaType}/${title.replace(/\s+/g, "-").toLowerCase()}`}
      className="relative group"
    >
      <div className="relative">
        <div className="cursor-pointer rounded-lg p-1 group transition-transform transform hover:scale-105 relative">
          <div className="relative">
            <Image
              src={posterUrl}
              alt={title}
              width={500}
              height={750}
              className="object-cover group-hover:opacity-60 rounded-lg"
            />
          </div>
          <div className="mt-2 relative">
            <h1 className="text-xs md:text-sm font-medium text-gray-400">
              {releaseYear}
            </h1>
            <div>
              <h1 className="font-bold line-clamp-1 text-xs md:text-base">
                {title}
              </h1>
              <div className="flex justify-between flex-wrap">
                <h1 className="md:text-sm max-w-32 break-words text-xs font-medium line-clamp-1">
                  {genre}
                </h1>
                {voteAverage !== "N/A" && (
                  <h1 className="text-xs">{voteAverage}⭐</h1>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}