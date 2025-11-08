"use client";

import getQueryClient from "@core/infrastructure/configs/tanstack-query/get-query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { PropsWithChildren } from "react";

const QueryProvider = ({ children }: PropsWithChildren) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;
