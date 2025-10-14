import { clsx } from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  tabListStyle,
  tabListWrapper,
  tabPanelStyle,
  tabStyle,
  tabsContainerStyle,
} from "./style.css";
import { TabsProvider, useTabsContext } from "./TabsContext";
import type { TabListProps, TabPanelProps, TabProps, TabsProps } from "./types";
import { useTab, useTabPanel, useTabs } from "./useTab";
import { useTabScroll } from "./useTabScroll";

/**
 * Tabs 컴포넌트 - 탭 UI의 최상위 컨테이너
 *
 * @param defaultValue - 초기 선택될 탭의 값
 * @param scrollOffset - 탭 전환 시 스크롤할 추가 오프셋 (예: 고정된 NavBar 높이)
 * @param className - 추가 CSS 클래스
 */
const Tabs = ({
  children,
  defaultValue,
  className,
  scrollOffset = 0,
}: TabsProps) => {
  const { value, onChange: handleChange } = useTabs({
    defaultValue,
  });

  const [tabListRef, setTabListRef] = useState<HTMLDivElement | null>(null);

  const handleSetTabListRef = useCallback((ref: HTMLDivElement | null) => {
    setTabListRef(ref);
  }, []);

  const contextValue = useMemo(
    () => ({
      value,
      onChange: handleChange,
      scrollOffset,
      tabListRef,
      setTabListRef: handleSetTabListRef,
    }),
    [value, handleChange, scrollOffset, tabListRef, handleSetTabListRef],
  );

  return (
    <TabsProvider value={contextValue}>
      <div className={clsx(tabsContainerStyle, className)}>{children}</div>
    </TabsProvider>
  );
};

/**
 * TabList 컴포넌트 - 탭 버튼들을 담는 리스트 컨테이너
 */
const TabList = ({ children, className }: TabListProps) => {
  const tabListRef = useRef<HTMLDivElement>(null);

  const { setTabListRef, scrollOffset } = useTabsContext();

  // TabList가 마운트되면 부모 Tabs 컴포넌트에 ref 전달
  // 이렇게 하면 TabPanel에서 TabList의 높이를 계산할 수 있음
  // 언마운트 시 ref를 정리하여 메모리 누수 방지
  useEffect(() => {
    const node = tabListRef.current;
    if (setTabListRef) setTabListRef(node);
    return () => setTabListRef?.(null);
  }, [setTabListRef]);

  return (
    <div
      ref={tabListRef}
      role="tablist"
      className={clsx(tabListStyle(), tabListWrapper, className)}
      style={{ top: `${scrollOffset}px` }}
    >
      {children}
    </div>
  );
};

/**
 * Tab 컴포넌트 - 개별 탭 버튼
 *
 * @param value - 이 탭의 고유 값
 * @param disabled - 비활성화 여부
 * @param onClick - 클릭 핸들러
 */
const Tab = ({ value, children, disabled, className, onClick }: TabProps) => {
  const { value: selectedValue, onChange } = useTabsContext();

  const { tabProps, isSelected } = useTab(
    { value, disabled, onClick },
    selectedValue,
    onChange,
  );

  return (
    <button
      {...tabProps}
      type="button"
      className={clsx(
        tabStyle({
          isActive: isSelected,
          disabled,
        }),
        className,
      )}
    >
      {children}
    </button>
  );
};

/**
 * TabPanel 컴포넌트 - 탭 내용을 표시하는 패널
 *
 * 탭 전환 시 자동으로 스크롤하여 패널이 TabList에 가려지지 않도록 처리
 *
 * @param value - 이 패널의 고유 값 (해당하는 Tab의 value와 일치)
 */
const TabPanel = ({ value, children, className }: TabPanelProps) => {
  const { value: selectedValue, scrollOffset, tabListRef } = useTabsContext();

  const { tabPanelProps, isActive } = useTabPanel({ value }, selectedValue);

  const panelRef = useRef<HTMLDivElement>(null);

  // 탭 전환 시 스크롤 처리
  useTabScroll({
    isActive,
    panelRef,
    scrollOffset,
    tabListRef,
  });

  if (!isActive) {
    return null;
  }

  return (
    <div
      {...tabPanelProps}
      ref={panelRef}
      className={clsx(tabPanelStyle, className)}
    >
      {children}
    </div>
  );
};

Tabs.displayName = "Tabs";
TabList.displayName = "TabList";
Tab.displayName = "Tab";
TabPanel.displayName = "TabPanel";

const TabsWithCompounds = Object.assign(Tabs, {
  List: TabList,
  Item: Tab,
  Panel: TabPanel,
});

export { TabsWithCompounds as Tabs };
export { TabList, Tab, TabPanel };
