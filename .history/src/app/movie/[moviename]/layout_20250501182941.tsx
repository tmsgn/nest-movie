import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { moviename: string };
}): Promise<Metadata> {
  return {
    title: `${params.moviename.replace(/-/g, " ")}`,
    description: `Watch ${params.moviename.replace(/-/g, " ")} on NestMovie`,
  };
}

export default function MovieLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
