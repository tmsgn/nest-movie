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
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Poppins', sans-serif" }}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}