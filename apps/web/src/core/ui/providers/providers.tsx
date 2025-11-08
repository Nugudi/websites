"use client";

import type { PropsWithChildren } from "react";
import { RegisterServiceWorkerClient } from "../../infrastructure/configs/pwa/register-service-worker-client";
import QueryProvider from "./modules/query-provider";
import { ThemeScript } from "./scripts/theme-script";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <>
      <RegisterServiceWorkerClient />
      <ThemeScript />
      <QueryProvider>{children}</QueryProvider>
    </>
  );
};

export default Providers;
