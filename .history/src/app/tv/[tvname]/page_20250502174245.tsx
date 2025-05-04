export default function TVpage({params}: {params: {tvname: string}}) {
    const tvName = decodeURIComponent(params.tvname);
    return (
        <div className="p-4">
        <h1 className="text-2xl font-bold">{tvName}</h1>
        <p>Here’s where you show TV details!</p>

        {/* Add your TV show details here */}
        <p>More details about {tvName} will go here.</p>
        <p>You can add episodes, seasons, and other information.</p>
        <p>For example, you can show a list of episodes or seasons.</p>
        <p>Or you can show a summary of the show.</p>

        </div>
    );
}