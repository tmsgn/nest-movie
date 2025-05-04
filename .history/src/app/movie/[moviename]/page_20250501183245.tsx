import { useEffect, useState } from "react";

export default function MoviePage({ params }: { params: { moviename: string } }) {
    const { moviename } = params;
    const [movieid, setMovieId] = useState<string>("");

    useEffect(() => {
      
        const fetchMovieId = async () => {
            const id = "12345"; // Replace with dynamic logic
            setMovieId(id);
        };

        fetchMovieId();
    }, []);

    return (
        <div>
            <h1>Movie: {moviename}</h1>
            <p>Movie ID: {movieid || "Loading..."}</p>
            <p>Details about the movie will be displayed here.</p>
        </div>
    );
}