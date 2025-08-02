import { createContext, useContext } from "react";

export interface UseTabsContext {
  value: string;
  onChange: (value: string) => void;
  size: "full";
}

const TabsContext = createContext<UseTabsContext | null>(null);

export const TabsProvider = TabsContext.Provider;

export function useTabsContext<T extends boolean | undefined = true>({
  strict = true,
}: {
  strict?: T;
} = {}): T extends false ? UseTabsContext | null : UseTabsContext {
  const context = useContext(TabsContext);

  if (!context && strict) {
    throw new Error("useTabsContext must be used within a Tabs");
  }

  return context as UseTabsContext;
}
