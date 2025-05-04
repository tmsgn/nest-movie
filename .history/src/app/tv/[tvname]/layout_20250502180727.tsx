export default function TVlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" p-4">
      <h1 className="text-2xl font-bold">TV Shows</h1>
      <p>Here’s where you show TV show details!</p>
      {children}
    </div>
  );
}