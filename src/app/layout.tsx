import "./globals.css";
import NavBar from "@/components/Navbar";
export const metadata = {
  title: "NestMovie",
  description: "Movie Website",
  openGraph: {
    title: "NestMovie",
    description: "Movie Website",
    images: [
      {
        url: "/ChatGPT Image May 5, 2025, 03_52_55 PM.png",
        width: 1200,
        height: 630,
        alt: "NestMovie Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NestMovie",
    description: "Movie Website",
    images: ["/ChatGPT Image May 5, 2025, 03_52_55 PM.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        style={{ fontFamily: "'Poppins', sans-serif", overflowX: "hidden" }}
        className="bg-gray-900 text-white scrollbar"
      >
        <NavBar />
        {children}
      </body>
    </html>
  );
}
