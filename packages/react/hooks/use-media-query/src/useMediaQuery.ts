"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { UseMediaQueryProps, UseMediaQueryReturn } from "./types";

// Type guards for legacy browser support
const supportsModernEvents = (
  mq: MediaQueryList,
): mq is MediaQueryList & {
  addEventListener: MediaQueryList["addEventListener"];
  removeEventListener: MediaQueryList["removeEventListener"];
} => {
  return (
    typeof mq.addEventListener === "function" &&
    typeof mq.removeEventListener === "function"
  );
};

interface LegacyMediaQueryList
  extends Omit<MediaQueryList, "addListener" | "removeListener"> {
  addListener?: (listener: (e: MediaQueryListEvent) => void) => void;
  removeListener?: (listener: (e: MediaQueryListEvent) => void) => void;
}

/**
 * Hook for tracking media query matches
 * @param query - Media query string (e.g., '(min-width: 768px)')
 * @param defaultMatches - Initial match state for SSR (default: false)
 * @param onChange - Callback when match state changes
 * @param matchMedia - Optional matchMedia function for testing
 * @returns {UseMediaQueryReturn} An object containing:
 *   - `matches` {boolean}: Current match state. `true` if the media query matches the current viewport, `false` otherwise.
 *                          Automatically updates when viewport changes.
 *   - `query` {string}: The media query string being evaluated. Same as the input query parameter.
 *
 * @example
 * ```tsx
 * const { matches, query } = useMediaQuery({
 *   query: "(min-width: 768px)"
 * });
 *
 * if (matches) {
 *   // Render desktop layout when viewport is 768px or wider
 *   return <DesktopLayout />;
 * }
 * ```
 */
export function useMediaQuery({
  query,
  defaultMatches = false,
  onChange,
  matchMedia: customMatchMedia,
}: UseMediaQueryProps): UseMediaQueryReturn {
  const [matches, setMatches] = useState<boolean>(defaultMatches);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const isInitializedRef = useRef(false);

  const getMatchMedia = useCallback(() => {
    if (customMatchMedia) return customMatchMedia;
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia;
    }
    return null;
  }, [customMatchMedia]);

  const handleChange = useCallback(
    (event: MediaQueryListEvent | MediaQueryList) => {
      const newMatches = event.matches;
      setMatches(newMatches);
    },
    [],
  );

  useEffect(() => {
    // Reset initialization flag when query changes
    isInitializedRef.current = false;

    const matchMediaFn = getMatchMedia();
    if (!matchMediaFn) return;

    const mediaQuery = matchMediaFn(query);

    setMatches(mediaQuery.matches);
    isInitializedRef.current = true;

    if (supportsModernEvents(mediaQuery)) {
      mediaQuery.addEventListener("change", handleChange);
      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    } else {
      const legacyMq = mediaQuery as LegacyMediaQueryList;
      legacyMq.addListener?.(handleChange);
      return () => {
        legacyMq.removeListener?.(handleChange);
      };
    }
  }, [query, handleChange, getMatchMedia]);

  useEffect(() => {
    if (isInitializedRef.current && onChangeRef.current) {
      onChangeRef.current(matches);
    }
  }, [matches]);

  return {
    matches,
    query,
  };
}

/**
 * 반응형 디자인을 위한 브레이크포인트 상수
 * Tailwind CSS의 기본 브레이크포인트와 동일
 *
 * @example
 * ```tsx
 * // 직접 사용
 * const { matches } = useMediaQuery({ query: BREAKPOINTS.md });
 *
 * // 커스텀 조합
 * const isTablet = useMediaQuery({
 *   query: `${BREAKPOINTS.md} and (max-width: 1023px)`
 * });
 * ```
 */
export const BREAKPOINTS = {
  /** 0px 이상 - 모든 화면 */
  xs: "(min-width: 0px)",
  /** 640px 이상 - 큰 모바일 */
  sm: "(min-width: 640px)",
  /** 768px 이상 - 태블릿 */
  md: "(min-width: 768px)",
  /** 1024px 이상 - 작은 데스크톱 */
  lg: "(min-width: 1024px)",
  /** 1280px 이상 - 데스크톱 */
  xl: "(min-width: 1280px)",
  /** 1536px 이상 - 대형 데스크톱 */
  "2xl": "(min-width: 1536px)",
} as const;

/**
 * 0px 이상 화면 체크 (모든 화면)
 *
 * @param props - defaultMatches, onChange 등 옵션
 * @returns 현재 화면이 0px 이상인지 여부
 *
 * @example
 * ```tsx
 * const { matches } = useIsXs();
 * // matches는 항상 true (모든 화면에서)
 * ```
 */
export const useIsXs = (props?: Omit<UseMediaQueryProps, "query">) =>
  useMediaQuery({ ...props, query: BREAKPOINTS.xs });

/**
 * 640px 이상 화면 체크 (큰 모바일부터)
 *
 * @param props - defaultMatches, onChange 등 옵션
 * @returns 현재 화면이 640px 이상인지 여부
 *
 * @example
 * ```tsx
 * const { matches: isLargeMobile } = useIsSm();
 * if (isLargeMobile) {
 *   // 640px 이상에서만 표시할 콘텐츠
 * }
 * ```
 */
export const useIsSm = (props?: Omit<UseMediaQueryProps, "query">) =>
  useMediaQuery({ ...props, query: BREAKPOINTS.sm });

/**
 * 768px 이상 화면 체크 (태블릿부터)
 *
 * @param props - defaultMatches, onChange 등 옵션
 * @returns 현재 화면이 768px 이상인지 여부
 *
 * @example
 * ```tsx
 * const { matches: isTabletOrLarger } = useIsMd();
 * return isTabletOrLarger ? <TwoColumnLayout /> : <SingleColumnLayout />;
 * ```
 */
export const useIsMd = (props?: Omit<UseMediaQueryProps, "query">) =>
  useMediaQuery({ ...props, query: BREAKPOINTS.md });

/**
 * 1024px 이상 화면 체크 (데스크톱부터)
 *
 * @param props - defaultMatches, onChange 등 옵션
 * @returns 현재 화면이 1024px 이상인지 여부
 *
 * @example
 * ```tsx
 * const { matches: isDesktop } = useIsLg();
 * return (
 *   <Navigation>
 *     {isDesktop && <DesktopMenu />}
 *     {!isDesktop && <MobileMenu />}
 *   </Navigation>
 * );
 * ```
 */
export const useIsLg = (props?: Omit<UseMediaQueryProps, "query">) =>
  useMediaQuery({ ...props, query: BREAKPOINTS.lg });

/**
 * 1280px 이상 화면 체크 (큰 데스크톱)
 *
 * @param props - defaultMatches, onChange 등 옵션
 * @returns 현재 화면이 1280px 이상인지 여부
 *
 * @example
 * ```tsx
 * const { matches: isLargeScreen } = useIsXl();
 * const columns = isLargeScreen ? 4 : 3;
 * ```
 */
export const useIsXl = (props?: Omit<UseMediaQueryProps, "query">) =>
  useMediaQuery({ ...props, query: BREAKPOINTS.xl });

/**
 * 1536px 이상 화면 체크 (초대형 모니터)
 *
 * @param props - defaultMatches, onChange 등 옵션
 * @returns 현재 화면이 1536px 이상인지 여부
 *
 * @example
 * ```tsx
 * const { matches: isUltraWide } = useIs2xl();
 * if (isUltraWide) {
 *   // 초대형 화면에서만 보여줄 추가 사이드바
 *   return <ExtraSidebar />;
 * }
 * ```
 */
export const useIs2xl = (props?: Omit<UseMediaQueryProps, "query">) =>
  useMediaQuery({ ...props, query: BREAKPOINTS["2xl"] });

/**
 * 디바이스 타입을 판단하는 유틸리티 훅
 * 모바일, 태블릿, 데스크톱을 구분하여 반환
 *
 * @returns 디바이스 타입 객체
 * @returns {boolean} isMobile - 767px 이하 화면 (모바일)
 * @returns {boolean} isTablet - 768px ~ 1023px 화면 (태블릿)
 * @returns {boolean} isDesktop - 1024px 이상 화면 (데스크톱)
 *
 * @example
 * ```tsx
 * const { isMobile, isTablet, isDesktop } = useDeviceType();
 *
 * // 디바이스별 다른 레이아웃
 * if (isMobile) return <MobileLayout />;
 * if (isTablet) return <TabletLayout />;
 * if (isDesktop) return <DesktopLayout />;
 * ```
 *
 * @example
 * ```tsx
 * const { isMobile } = useDeviceType();
 *
 * // 모바일에서만 하단 네비게이션
 * return (
 *   <>
 *     {!isMobile && <Header />}
 *     <MainContent />
 *     {isMobile && <BottomNav />}
 *   </>
 * );
 * ```
 */
export const useDeviceType = () => {
  const isMobile = useMediaQuery({
    query: "(max-width: 767px)",
    defaultMatches: false,
  });

  const isTablet = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1023px)",
    defaultMatches: false,
  });

  const isDesktop = useMediaQuery({
    query: "(min-width: 1024px)",
    defaultMatches: true,
  });

  return {
    /** 767px 이하 화면 */
    isMobile: isMobile.matches,
    /** 768px ~ 1023px 화면 */
    isTablet: isTablet.matches,
    /** 1024px 이상 화면 */
    isDesktop: isDesktop.matches,
  };
};
