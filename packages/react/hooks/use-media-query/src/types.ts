export interface UseMediaQueryProps {
  query: string;
  defaultMatches?: boolean;
  onChange?: (matches: boolean) => void;
  // For testing
  matchMedia?: Window["matchMedia"];
}

export interface UseMediaQueryReturn {
  matches: boolean;
  query: string;
}
