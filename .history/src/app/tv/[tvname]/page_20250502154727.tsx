
export function generateMetadata({params}: {params: {tvname: string}}): {title: string; description: string} {
    const title = decodeURIComponent(params.tvname);
    return {
        title: `${title.charAt(0).toUpperCase()}${title.slice(1)}`,
        description: `Watch ${title.charAt(0).toUpperCase()}${title.slice(1)} on MovieNest`,
    };
}
export default async function TVPage(){
    return(
        <h1>hello</h1>
    )
}