"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { MixpanelProvider } from "./components/mixpanel-provider";
import { getQueryClient } from "./get-query-client";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MixpanelProvider>{children}</MixpanelProvider>
    </QueryClientProvider>
  );
}
