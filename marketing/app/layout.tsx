import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Beach Events | Beach Builds, Brand Activations & Sport Environments",
  description:
    "We put sand where it doesn't belong. Permanent, pop-up and branded beach environments across the UK.",
  openGraph: {
    title: "Beach Events | Beach Builds, Brand Activations & Sport Environments",
    description:
      "We put sand where it doesn't belong. Permanent, pop-up and branded beach environments across the UK.",
    url: "https://beach-events.co.uk",
    siteName: "Beach Events",
    type: "website",
    locale: "en_GB",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
