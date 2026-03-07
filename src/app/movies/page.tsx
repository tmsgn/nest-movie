import DiscoverContent from "@/components/DiscoverContent";

export const metadata = {
  title: "Explore Movies – NestMovie",
  description:
    "Browse and filter thousands of movies by genre, year, rating and more.",
};

export default function MoviesPage() {
  return <DiscoverContent type="movie" />;
}
