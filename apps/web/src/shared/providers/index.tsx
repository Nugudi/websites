"use client";

import type { PropsWithChildren } from "react";
import QueryProvider from "./modules/query-provider";

function Providers({ children }: PropsWithChildren) {
  return <QueryProvider>{children}</QueryProvider>;
}

export default Providers;
