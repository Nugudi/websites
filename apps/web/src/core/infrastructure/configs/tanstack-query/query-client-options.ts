import { HttpError } from "@core/infrastructure/http/fetch-http-client";
import { defaultShouldDehydrateQuery, type Query } from "@tanstack/react-query";

/**
 * TanStack Query Configuration
 *
 * Retry Policy:
 * - 401 에러는 재시도하지 않음
 *   (AuthenticatedHttpClient가 이미 Token Refresh + 자동 재시도를 투명하게 처리함)
 * - 4xx 클라이언트 에러(401 제외)는 재시도하지 않음 (잘못된 요청이므로 재시도 무의미)
 * - 5xx 서버 에러 및 네트워크 에러는 2회 재시도 (일시적 장애 가능성)
 *
 * Exponential Backoff:
 * - 1차 재시도: 1초 후
 * - 2차 재시도: 2초 후
 * - 최대 대기: 10초
 */
const queryClientOptions = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: (failureCount: number, error: unknown) => {
        // 401 에러는 재시도하지 않음
        // Interceptor가 Token Refresh + 재시도를 투명하게 처리했으므로
        // TanStack Query가 보는 401은 Refresh도 실패한 최종 실패 상태
        if (error instanceof HttpError && error.status === 401) {
          return false;
        }

        // 4xx 클라이언트 에러는 재시도하지 않음 (잘못된 요청)
        if (
          error instanceof HttpError &&
          error.status >= 400 &&
          error.status < 500
        ) {
          return false;
        }

        // 5xx 서버 에러 및 네트워크 에러는 최대 2회 재시도
        return failureCount < 2;
      },
      retryDelay: (attemptIndex: number) => {
        return Math.min(1000 * 2 ** attemptIndex, 10000);
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
