"use client";

import { usePathname } from "next/navigation";
import type React from "react";

export function ConditionalPaddingWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't apply padding for homepage or legal pages
  const shouldApplyPadding = pathname !== "/" && !pathname.startsWith("/legal");

  return <div className={shouldApplyPadding ? "md:px-[200px]" : ""}>{children}</div>;
}
