import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/app/globals.css";
import { TrackingScripts } from "@/components/tracking-scripts";
import { siteConfig } from "@/lib/site-config";

const geist = localFont({
  src: "../../public/fonts/geist-latin.woff2",
  variable: "--font-geist",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "Cash Home Offers in Atlanta and Across Georgia | Max Cash Offers",
  description:
    "Compare a possible cash offer with an open-market listing through a licensed, Atlanta-based Georgia realtor. No obligation to sell.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "A cash offer when speed matters | Max Cash Offers",
    description:
      "Clear selling options for Atlanta and Georgia homeowners, led by a licensed local realtor.",
    url: "/",
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Elegant Atlanta home surrounded by mature Georgia landscaping",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Max Cash Offers",
    description:
      "Compare a cash offer with the open market for your Georgia property.",
    images: ["/og-home.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        {children}
        <TrackingScripts />
      </body>
    </html>
  );
}
