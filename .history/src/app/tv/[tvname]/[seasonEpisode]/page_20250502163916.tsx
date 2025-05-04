export default function EpisodePage({
  params,
}: {
  params: { tvname: string; seasonEpisode: string };
}) {
  return (
    <div className="text-white p-4">
      <h1 className="text-2xl font-bold">
        {decodeURIComponent(params.tvname)} - {params.seasonEpisode}
      </h1>
      <p>Here’s where you show episode details!</p>
    </div>
  );
}
