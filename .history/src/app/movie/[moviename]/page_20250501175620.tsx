// app/movie/[moviename]/page.tsx
export default function MoviePage({ params }: { params: { moviename: string } }) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Movie: {decodeURIComponent(params.moviename)}</h1>
      </div>
    )
  }
  