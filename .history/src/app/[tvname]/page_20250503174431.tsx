export default function TVPlayer({params}: {params: {tvname: string}}) {
    const tvname= decodeURIComponent(params.tvname).replace(/-/g, " ");
    const sanitizedTvName = tvname.replace(/[^a-zA-Z0-9 ]/g, "");
    return(
        <h1>{tvname}</h1>
    )
}