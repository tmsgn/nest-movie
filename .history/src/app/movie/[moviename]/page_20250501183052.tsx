export default function MoviePage({ params }: { params: { moviename: string } }) {
    const { moviename } = params;
    
    return (
        <div>
        <h1>Movie: {moviename}</h1>
        <p>Details about the movie will be displayed here.</p>
        </div>
    );
}