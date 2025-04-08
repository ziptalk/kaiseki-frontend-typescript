import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kaiseki",
  description:
    "Create your coin with near-zero fee. Trade instantly. Win Big. Each coin on Kaiseki is a fair-launch with no presale and no team allocation. ",
  icons: {
    icon: "/images/kaisekilogo.png",
  },
};
import { arial } from "@/fonts/font";
import Header from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { Suspense } from "react";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script src="/static/datafeeds/udf/dist/bundle.js" />
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
