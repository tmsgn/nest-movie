"use client";
import { useRouter } from "next/navigation";

export default function TVPage({ params }: { params: { tvname: string } }) {
  const router = useRouter();
  const { tvname } = params;

  // Example hardcoded seasons & episodes
  const seasons = [
    { season: 1, episodes: 10 },
    { season: 2, episodes: 8 },
    { season: 3, episodes: 12 },
  ];

  function handleEpisodeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    if (value) {
      router.push(`/episode/${tvname}/${value}`);
    }
  }

  return (
    <div className="text-white p-4">
      <h1 className="text-3xl font-bold mb-4">{decodeURIComponent(tvname)}</h1>

      <label className="block mb-2">Select Episode:</label>
      <select
        onChange={handleEpisodeChange}
        className="text-black p-2 rounded"
        defaultValue=""
      >
        <option value="" disabled>Select Season & Episode</option>
        {seasons.map((s) =>
          Array.from({ length: s.episodes }, (_, i) => (
            <option
              key={`${s.season}-${i + 1}`}
              value={`${s.season}-${i + 1}`}
            >
              Season {s.season} Episode {i + 1}
            </option>
          ))
        )}
      </select>
    </div>
  );
}
