export const metadata = {
    title: "NestMovie",
    description: "Movie Website",
}


export default function TVlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" p-4">
      {children}
    </div>
  );
}