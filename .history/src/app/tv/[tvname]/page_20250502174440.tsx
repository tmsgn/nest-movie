"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

interface Season {
    season_number: number;
    episode_count: number;
}

export default function TVPage({ params }: { params: Promise<{ tvname: string }> }) {
    const router = useRouter();
    const { tvname } = use(params); // Unwrap the params promise
    const tvName = decodeURIComponent(tvname);

    const [seasons, setSeasons] = useState<Season[]>([]);
    const [loading, setLoading] = useState(true);

    const API_KEY = "b6a27c41bfadea6397dcd72c3877cac1";

    useEffect(() => {
        async function fetchTVDetails() {
            try {
                // 1. Search TV show by name to get ID
                const searchRes = await fetch(
                    `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${tvName}`
                );
                const searchData = await searchRes.json();
                const tvShow = searchData.results[0];

                if (!tvShow) return;

                // 2. Get show details including seasons
                const detailsRes = await fetch(
                    `https://api.themoviedb.org/3/tv/${tvShow.id}?api_key=${API_KEY}`
                );
                const detailsData = await detailsRes.json();
                setSeasons(detailsData.seasons);
            } catch (error) {
                console.error("Error fetching TV details", error);
            } finally {
                setLoading(false);
            }
        }

        fetchTVDetails();
    }, [tvName]);

    function handleEpisodeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;
        if (value) {
            router.push(`/episode/${tvName}/${value}`);
        }
    }

    return (
        <div className="p-4 text-white">
            <h1 className="text-2xl font-bold mb-4">{tvName}</h1>

            {loading ? (
                <p>Loading seasons...</p>
            ) : (
                <div>
                    <label className="block mb-2">Select Episode:</label>
                    <select
                        onChange={handleEpisodeChange}
                        defaultValue=""
                        className="text-black p-2 rounded"
                    >
                        <option value="" disabled>
                            Select Season & Episode
                        </option>
                        {seasons
                            .filter((s) => s.season_number > 0) // skip season 0 (specials)
                            .map((season) =>
                                Array.from({ length: season.episode_count }, (_, i) => (
                                    <option
                                        key={`${season.season_number}-${i + 1}`}
                                        value={`${season.season_number}-${i + 1}`}
                                    >
                                        Season {season.season_number} Episode {i + 1}
                                    </option>
                                ))
                            )}
                    </select>
                </div>
            )}
        </div>
    );
}
