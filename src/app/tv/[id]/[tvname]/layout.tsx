import type { Metadata } from "next";
export function generateMetadata({
    params,
  }: {
    params: { tvname: string };
  }): Metadata {
    const title = decodeURIComponent(params.tvname);
    return {
      title: `${title.charAt(0).toUpperCase()}${title.slice(1)}`,
      description: `Watch ${title.charAt(0).toUpperCase()}${title.slice(1)} on MovieNest`,
    };
  }

export default function TVlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" p-4 w-screen overflow-x-hidden">
      {children}
    </div>
  );
}
