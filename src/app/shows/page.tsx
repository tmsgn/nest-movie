import DiscoverContent from "@/components/DiscoverContent";

export const metadata = {
  title: "Explore TV Shows – NestMovie",
  description:
    "Browse and filter thousands of TV shows by genre, year, rating and more.",
};

export default function ShowsPage() {
  return <DiscoverContent type="tv" />;
}
