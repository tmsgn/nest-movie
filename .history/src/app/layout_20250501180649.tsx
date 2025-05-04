import "./globals.css";
import { Poppins } from "next/font/google";
import NavBar from "@/components/Navbar";
import { title } from "process";
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata ={
  title: "NestMovie"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className={poppins.className}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
