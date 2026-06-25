import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./provider";
import { AppProvider } from "@/lib/AppContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const inter = Inter({
  subsets: ["latin"],
});
export const metadata = {
  title: "Book Appointments",
  description: "A simple appointment booking app built with Next.js 13, Tailwind CSS, and Prisma.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${inter.className} ${geistMono.variable} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col">

        <AppProvider>

          <Providers>
            {children}
          </Providers>
        </AppProvider>

      </body>
    </html>
  );
}
