import type { Metadata } from "next";
import type React from "react";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Melian",
  description: "Effortless shopping",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
