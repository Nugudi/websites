"use client";

import type { PropsWithChildren } from "react";
import { ThemeScript } from "@/shared/providers/scripts/theme-script";
import { RegisterServiceWorkerClient } from "../configs/pwa/register-service-worker-client";
import QueryProvider from "./modules/query-provider";

function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <RegisterServiceWorkerClient />
      <ThemeScript />
      <QueryProvider>{children}</QueryProvider>
    </>
  );
}

export default Providers;
