import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: '75 of 100 has moved',
  description: '7500 basis points. The two amounts are arguments. No pool is read.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
