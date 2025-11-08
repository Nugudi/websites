import { isServer, QueryClient } from "@tanstack/react-query";
import queryClientOptions from "./query-client-options";

function makeQueryClient() {
  return new QueryClient(queryClientOptions);
}

let browserQueryClient: QueryClient | undefined;

export default function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}
