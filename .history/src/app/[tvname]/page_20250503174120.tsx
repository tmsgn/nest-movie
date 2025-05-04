export default function TVPlayer({params}: {params: {tvname: string}}) {
    return(
        <h1>{params.tvname}</h1>
    )
}