export default function TVpage({params}: {params: {tvname: string}}) {
    const tvName = decodeURIComponent(params.tvname);
    return (
        <div className="p-4">
        <h1 className="text-2xl font-bold">{tvName}</h1>
        <p>Here’s where you show TV details!</p>

        </div>
    );
}