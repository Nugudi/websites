import { defaultShouldDehydrateQuery, type Query } from "@tanstack/react-query";
import { HttpError } from "@/src/shared/infrastructure/http/fetch-http-client";

/**
 * TanStack Query Configuration
 *
 * Retry Policy:
 * - 401 에러는 재시도하지 않음 (AuthenticatedHttpClient의 401 Interceptor가 자동 처리)
 * - 그 외 에러는 1회만 재시도
 */
const queryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: (failureCount: number, error: unknown) => {
        // 401 에러는 재시도하지 않음 (Interceptor가 이미 처리함)
        if (error instanceof HttpError && error.status === 401) {
          return false;
        }

        // 그 외 에러는 최대 1회 재시도
        return failureCount < 1;
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
    dehydrate: {
      shouldDehydrateQuery: (query: Query) =>
        defaultShouldDehydrateQuery(query) || query.state.status === "pending",
    },
  },
};

export default queryClientOptions;
