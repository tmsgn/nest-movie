import "./globals.css";
import { Poppins } from "next/font/google";
import NavBar from "@/components/Navbar";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

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
    <html lang="en" className={poppins.className}>
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