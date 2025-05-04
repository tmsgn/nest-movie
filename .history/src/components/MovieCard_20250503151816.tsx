<Link
  href={`/${movie.media_type}/${movie.id}-${encodeURIComponent(
    movie.title.toLowerCase().replace(/\s+/g, "-")
  )}`}
  className="group"
>
