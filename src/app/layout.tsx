import type { Metadata } from "next";
import { Graduate } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const grad = Graduate({
  subsets: ["latin"],
  weight: "400"
});

export const metadata: Metadata = {
  title: "ScoutChain",
  description: "Improve your skills - Scout the future - Earn ScoutCoins!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark mx-12 my-8">
      <body className={grad.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
