import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RFP Hub — Web3 Grant Aggregation",
  description:
    "Standard RFP object format and public aggregation API for web3 funding opportunities",
  openGraph: {
    title: "RFP Hub — Web3 Grant Aggregation",
    description:
      "Discover funding opportunities across the web3 ecosystem through a single, searchable API",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
