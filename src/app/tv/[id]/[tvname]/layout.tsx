import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tvname: string }>;
}): Promise<Metadata> {
  const { tvname } = await params;
  const title = decodeURIComponent(tvname).replace(/-/g, " ");
  return {
    title: `${title.charAt(0).toUpperCase()}${title.slice(1)} – NestMovie`,
    description: `Watch ${title} on NestMovie`,
  };
}

export default function TVlayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
