import type { Metadata } from "next";
import type React from "react";
import "./globals.css";
import { ConditionalPaddingWrapper } from "./components/conditional-padding-wrapper";
import { AppStoreHeader } from "./external-profile/[userId]/app-store-header";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Melian",
  description: "Effortless shopping",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppStoreHeader />
        <Providers>
          <ConditionalPaddingWrapper>{children}</ConditionalPaddingWrapper>
        </Providers>
      </body>
    </html>
  );
}
