import type { Metadata } from "next";
import { EB_Garamond, Instrument_Sans, Geist } from "next/font/google";
import { ThemeProvider } from "@/lib/theme";
import "./globals.css";

const lastik = EB_Garamond({
  variable: "--font-lastik",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Velt — AI Design Generator",
  description: "Describe what you want, and we handle the rest. From idea to stunning design in seconds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${lastik.variable} ${instrument.variable} ${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
