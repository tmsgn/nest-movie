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
        <p>Display episode details here</p>
      </div>
    );
  }
  