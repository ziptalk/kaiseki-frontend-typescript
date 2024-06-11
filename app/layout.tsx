import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "memesino.fun",
  description:
    "Create your coin with near-zero fee. Trade instantly. Win Big. Each coin on Memesino is a fair-launch with no presale and no team allocation. ",
  icons: {
    icon: "/memeLogo.png",
  },
};
import { arial, digital } from "@/fonts/font";
import Header from "@/components/shared/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${arial.variable} bg-[#0E0E0E] font-arial`}
      >
        <Provider>
          <Header />
          {children}
        </Provider>
      </body>
    </html>
  );
}
