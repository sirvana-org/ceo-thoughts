import type { ReactNode } from "react";

interface ExternalProfileLayoutProps {
  children: ReactNode;
}

export default function ExternalProfileLayout({ children }: ExternalProfileLayoutProps) {
  return <>{children}</>;
}
