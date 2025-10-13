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

const Tabs = ({
  children,
  defaultValue,
  className,
  style,
  scrollOffset = 0,
}: TabsProps) => {
  const { value, onChange: handleChange } = useTabs({
    defaultValue,
  });
  const [tabListRef, setTabListRef] = useState<HTMLDivElement | null>(null);

  const handleSetTabListRef = useCallback((ref: HTMLDivElement) => {
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
      <div className={clsx(tabsContainerStyle, className)} style={style}>
        {children}
      </div>
    </TabsProvider>
  );
};

const TabList = ({ children, className }: TabListProps) => {
  const tabListRef = useRef<HTMLDivElement>(null);
  const { setTabListRef, scrollOffset } = useTabsContext();

  useEffect(() => {
    if (setTabListRef && tabListRef.current) {
      setTabListRef(tabListRef.current);
    }
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

const TabPanel = ({ value, children, className }: TabPanelProps) => {
  const { value: selectedValue, scrollOffset, tabListRef } = useTabsContext();
  const { tabPanelProps, isActive } = useTabPanel({ value }, selectedValue);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive) return;

    // 탭 전환 시 DOM 업데이트 후 스크롤 처리
    requestAnimationFrame(() => {
      if (!panelRef.current) return;

      // tabListRef가 없거나 offsetHeight가 없으면 스크롤 처리 건너뛰기
      const tabListHeight = tabListRef?.offsetHeight ?? 0;

      // tabList의 높이가 없으면 스크롤 처리하지 않음
      if (tabListHeight === 0) return;

      const totalOffset = scrollOffset + tabListHeight;
      const elementTop = panelRef.current.getBoundingClientRect().top;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // TabPanel이 화면 위쪽에 가려져 있을 때만 스크롤
      if (elementTop < totalOffset) {
        const offsetPosition = scrollTop + elementTop - totalOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  }, [isActive, scrollOffset, tabListRef]);

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
