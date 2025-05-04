<div className="w-full flex justify-center items-center sm:w-fit">
  <Image
    src={`https://image.tmdb.org/t/p/w500${tvshow?.poster_path}`}
    alt={tvshow?.title || "TV show poster"}
    width={500}
    height={750}
    className="object-cover max-w-72 h-96 rounded-lg"
  />
</div>
