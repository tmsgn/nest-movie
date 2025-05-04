import "./globals.css";
import NavBar from "@/components/Navbar";

export const metadata = {
  title: "NestMovie",
  description: "Movie Website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}