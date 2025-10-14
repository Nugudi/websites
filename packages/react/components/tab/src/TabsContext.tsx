import { createContext, useContext } from "react";

/**
 * Tabs Context의 타입 정의
 *
 * @property value - 현재 선택된 탭의 값
 * @property onChange - 탭 변경 핸들러
 * @property scrollOffset - 고정된 NavBar 등의 높이 (스크롤 계산에 사용)
 * @property tabListRef - TabList의 DOM 참조 (높이 계산에 사용)
 * @property setTabListRef - TabList에서 ref를 설정하는 함수
 */
export interface UseTabsContext {
  value: string;
  onChange: (value: string) => void;
  scrollOffset: number;
  tabListRef?: HTMLDivElement | null;
  setTabListRef?: (ref: HTMLDivElement | null) => void;
}

const TabsContext = createContext<UseTabsContext | null>(null);
export const TabsProvider = TabsContext.Provider;

/**
 * Tabs Context를 사용하는 커스텀 훅
 *
 * @example
 * const { value, onChange } = useTabsContext();
 */
export function useTabsContext(): UseTabsContext {
  const context = useContext(TabsContext);

  // Context가 없으면 에러 발생 (Tabs 컴포넌트 외부에서 사용 방지)
  if (!context) {
    throw new Error("useTabsContext must be used within a Tabs");
  }

  return context;
}
