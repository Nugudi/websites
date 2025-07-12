"use client";

import type { PropsWithChildren } from "react";
import { RegisterServiceWorkerClient } from "../configs/pwa/register-service-worker-client";
import QueryProvider from "./modules/query-provider";

function Providers({ children }: PropsWithChildren) {
  return (
    <>
      <RegisterServiceWorkerClient />
      <QueryProvider>{children}</QueryProvider>
    </>
  );
}

export default Providers;
