export default function TVPlayer({params}: {params: {tvname: string}}) {
    const tvname= decodeURIComponent(params.tvname).replace(/-/g, " ");
    return(
        <h1>{tvname}</h1>
    )
}