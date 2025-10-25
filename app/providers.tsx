"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "./get-query-client";
import { MixpanelProvider } from "./components/mixpanel-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MixpanelProvider>{children}</MixpanelProvider>
    </QueryClientProvider>
  );
}
