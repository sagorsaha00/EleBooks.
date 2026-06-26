"use client"; // 1. Crucial: This must be a client component

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AppProvider } from "../lib/AppContext";

export default function Providers({ children }) {
  // 2. Create the query client inside a state to avoid sharing data
  // between different users on the server.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute default stale time
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>{children}</AppProvider>
    </QueryClientProvider>
  );
}
