import type { Metadata } from "next";

type Props = {
  children: React.ReactNode;
  params: {
    id: string;
    tvname: string;
  };
};

export function generateMetadata({ params }: Props): Metadata {
  const title = decodeURIComponent(params.tvname);
  return {
    title: `${title.charAt(0).toUpperCase()}${title.slice(1)}`,
    description: `Watch ${title.charAt(0).toUpperCase()}${title.slice(1)} on MovieNest`,
  };
}

export default function TVlayout({ children }: Props) {
  return (
    <div className="p-4 w-screen overflow-x-hidden">
      {children}
    </div>
  );
}
