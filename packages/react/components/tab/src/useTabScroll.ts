import { type RefObject, useEffect } from "react";

/**
 * useTabScroll 훅
 *
 * 탭 전환 시 해당 탭 패널이 TabList에 가려지지 않도록 자동으로 스크롤 처리
 *
 * @param isActive - 현재 패널이 활성화되었는지 여부
 * @param panelRef - 패널 DOM 요소의 ref
 * @param scrollOffset - 탭 전환 시 스크롤할 추가 오프셋 (예: 고정된 NavBar 높이)
 * @param tabListRef - TabList DOM 요소의 ref (높이 계산에 사용)
 */
export const useTabScroll = ({
  isActive,
  panelRef,
  scrollOffset,
  tabListRef,
}: {
  isActive: boolean;
  panelRef: RefObject<HTMLDivElement | null>;
  scrollOffset: number;
  tabListRef: HTMLDivElement | null | undefined;
}) => {
  useEffect(() => {
    // 활성화되지 않은 패널은 스크롤 처리하지 않음
    if (!isActive) return;

    const rafId = requestAnimationFrame(() => {
      if (!panelRef.current) return;

      const tabListHeight = tabListRef?.offsetHeight ?? 0;

      // TabList 높이와 scrollOffset이 모두 0이면 스크롤 처리 불필요
      if (tabListHeight === 0 && scrollOffset === 0) return;

      // 전체 오프셋 = NavBar 높이 + TabList 높이
      const totalOffset = scrollOffset + tabListHeight;

      // 패널의 현재 화면상 위치 (viewport 기준)
      const elementTop = panelRef.current.getBoundingClientRect().top;

      // 현재 페이지의 스크롤 위치
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // 패널이 TabList에 가려져 있는지 확인
      if (elementTop < totalOffset) {
        // 현재 스크롤 위치 + 패널의 상대 위치 - 전체 오프셋
        const offsetPosition = Math.max(
          0,
          scrollTop + elementTop - totalOffset,
        );

        // 미세한 떨림이나 리플로우/리페인트 비용 절감을 위해 1px 임계값 적용
        if (Math.abs(window.scrollY - offsetPosition) > 1) {
          // 모션에 민감한 사용자를 배려하여 WCAG 권장사항 준수
          const prefersReduced =
            typeof window.matchMedia === "function" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

          window.scrollTo({
            top: offsetPosition,
            behavior: prefersReduced ? "auto" : "smooth",
          });
        }
      }
    });

    // cleanup: 컴포넌트 언마운트 시 대기 중인 애니메이션 프레임 취소
    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [isActive, scrollOffset, tabListRef, panelRef]);
};
