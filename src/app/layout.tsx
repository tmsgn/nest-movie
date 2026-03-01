import "./globals.css";
import NavBar from "@/components/Navbar";

export const metadata = {
  title: "NestMovie – Watch Movies & TV Shows Online",
  description:
    "Stream the latest trending movies and TV shows for free in HD quality on NestMovie.",
  openGraph: {
    title: "NestMovie – Watch Free Movies & TV Shows",
    description:
      "Stream the latest trending movies and TV shows for free in HD quality on NestMovie.",
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
    description: "Stream the latest trending movies and TV shows for free.",
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0f" />
      </head>
      <body className="scrollbar">
        <NavBar />
        <div style={{ minHeight: "100vh" }}>{children}</div>
        <footer
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(10,10,20,0.98)",
            padding: "32px 24px",
            textAlign: "center",
            color: "#8888a8",
            fontSize: "0.82rem",
          }}
        >
          <p style={{ marginBottom: "6px" }}>
            <span style={{ color: "#f5c518", fontWeight: 700 }}>NestMovie</span>{" "}
            — All content is sourced from third-party providers. We do not host
            any files.
          </p>
          <p>
            © {new Date().getFullYear()} NestMovie. Built for entertainment.
          </p>
        </footer>
      </body>
    </html>
  );
}
