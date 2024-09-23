import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RWE",
  description:
    "Create your coin with near-zero fee. Trade instantly. Win Big. Each coin on Memeslot is a fair-launch with no presale and no team allocation. ",
  icons: {
    icon: "icons/logo_icon.svg",
  },
};
import { arial } from "@/fonts/font";
import Header from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${arial.variable} scroll-smooth bg-[#0E0E0E] font-arial`}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <Provider>
            <Header />
            {children}
            <Footer />
          </Provider>
        </Suspense>
      </body>
    </html>
  );
}
