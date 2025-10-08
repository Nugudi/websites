import { clsx } from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
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

const Tabs = ({ children, defaultValue, className, style }: TabsProps) => {
  const { value, onChange: handleChange } = useTabs({
    defaultValue,
  });

  const [contentIndex, setContentIndex] = useState(0);
  const valueToIndexMap = useRef(new Map<string, number>());
  const indexToValueMap = useRef(new Map<number, string>());

  useEffect(() => {
    return () => {
      valueToIndexMap.current.clear();
      indexToValueMap.current.clear();
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      value,
      onChange: handleChange,
      contentIndex,
      setContentIndex,
      valueToIndexMap: valueToIndexMap.current,
      indexToValueMap: indexToValueMap.current,
    }),
    [value, handleChange, contentIndex],
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
  return (
    <div
      role="tablist"
      className={clsx(tabListStyle(), tabListWrapper, className)}
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
  const {
    value: selectedValue,
    valueToIndexMap,
    indexToValueMap,
  } = useTabsContext();
  const { tabPanelProps, isActive } = useTabPanel({ value }, selectedValue);
  const isFirstRender = useRef(true);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentSize = valueToIndexMap.size;
    if (!valueToIndexMap.has(value)) {
      valueToIndexMap.set(value, currentSize);
      indexToValueMap.set(currentSize, value);
    }
  }, [value, valueToIndexMap, indexToValueMap]);

  useEffect(() => {
    if (isActive && !isFirstRender.current && panelRef.current) {
      const elementTop = panelRef.current.getBoundingClientRect().top;

      // TabPanel이 화면 위쪽에 가려져 있을 때만 스크롤
      if (elementTop < 0) {
        const offsetPosition = window.pageYOffset + elementTop - 40;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
    if (isFirstRender.current && isActive) {
      isFirstRender.current = false;
    }
  }, [isActive]);

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
