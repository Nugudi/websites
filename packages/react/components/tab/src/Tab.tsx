import { clsx } from "clsx";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  carouselContainerStyle,
  carouselViewportStyle,
  tabListStyle,
  tabPanelStyle,
  tabStyle,
  tabsContainerStyle,
} from "./style.css";
import {
  TabsCarouselProvider,
  useTabsCarouselContext,
} from "./TabsCarouselContext";
import { TabsProvider, useTabsContext } from "./TabsContext";
import type { TabListProps, TabPanelProps, TabProps, TabsProps } from "./types";
import { useTab, useTabPanel, useTabs } from "./useTab";
import { useTabsCarousel } from "./useTabsCarousel";

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

  useEffect(() => {
    const index = valueToIndexMap.current.get(value);
    if (index !== undefined && index !== contentIndex) {
      setContentIndex(index);
    }
  }, [value, contentIndex]);

  const handleSetContentIndex = useCallback(
    (index: number) => {
      setContentIndex(index);
      const tabValue = indexToValueMap.current.get(index);
      if (tabValue && tabValue !== value) {
        handleChange(tabValue);
      }
    },
    [value, handleChange],
  );

  const contextValue = useMemo(
    () => ({
      value,
      onChange: handleChange,
      contentIndex,
      setContentIndex: handleSetContentIndex,
      valueToIndexMap: valueToIndexMap.current,
      indexToValueMap: indexToValueMap.current,
    }),
    [value, handleChange, contentIndex, handleSetContentIndex],
  );

  const processChildren = (children: React.ReactNode): React.ReactNode => {
    if (!children) return null;

    const childrenArray = React.Children.toArray(children);
    let tabListElement: React.ReactElement | null = null;
    const tabPanelElements: React.ReactElement[] = [];
    const otherElements: React.ReactNode[] = [];

    childrenArray.forEach((child) => {
      if (React.isValidElement(child)) {
        if (
          child.type === TabList ||
          (child.type as React.ComponentType)?.displayName === "TabList"
        ) {
          tabListElement = child;
        } else if (
          child.type === TabPanel ||
          (child.type as React.ComponentType)?.displayName === "TabPanel"
        ) {
          tabPanelElements.push(child);
        } else {
          otherElements.push(child);
        }
      } else {
        otherElements.push(child);
      }
    });

    return (
      <>
        {tabListElement}
        {otherElements}
        {tabPanelElements.length > 0 && (
          <TabPanelContainer>{tabPanelElements}</TabPanelContainer>
        )}
      </>
    );
  };

  return (
    <TabsProvider value={contextValue}>
      <div className={clsx(tabsContainerStyle, className)} style={style}>
        {processChildren(children)}
      </div>
    </TabsProvider>
  );
};

const TabList = ({ children, className }: TabListProps) => {
  return (
    <div role="tablist" className={clsx(tabListStyle(), className)}>
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

const TabPanelContainer = ({ children }: { children: React.ReactNode }) => {
  const { valueToIndexMap, indexToValueMap } = useTabsContext();
  const carouselState = useTabsCarousel();
  const [isRebuilding, setIsRebuilding] = useState(false);
  const prevChildrenRef = useRef(children);

  const registerPanel = useCallback(
    (value: string) => {
      if (isRebuilding) return -1; // 재구성 중에는 등록 방지

      // 이미 등록된 패널이면 기존 인덱스 반환
      if (valueToIndexMap.has(value)) {
        const existingIndex = valueToIndexMap.get(value);
        if (existingIndex !== undefined) {
          return existingIndex;
        }
      }

      // 새 패널이면 다음 인덱스 할당
      const index = valueToIndexMap.size;
      valueToIndexMap.set(value, index);
      indexToValueMap.set(index, value);
      carouselState.updateTabIndex(value, index);
      return index;
    },
    [
      valueToIndexMap,
      indexToValueMap,
      carouselState.updateTabIndex,
      isRebuilding,
    ],
  );

  const contextValue = useMemo(
    () => ({
      ...carouselState,
      registerPanel,
    }),
    [carouselState, registerPanel],
  );

  useEffect(() => {
    // children이 실제로 변경되었는지 확인
    if (prevChildrenRef.current === children) {
      return;
    }
    prevChildrenRef.current = children;

    setIsRebuilding(true);

    valueToIndexMap.clear();
    indexToValueMap.clear();

    // children을 미리 스캔해서 패널 순서 할당
    if (children) {
      const childrenArray = React.Children.toArray(children);
      let panelIndex = 0;

      const scanForPanels = (element: React.ReactNode) => {
        if (React.isValidElement(element)) {
          if (
            element.type === TabPanel ||
            (element.type as React.ComponentType)?.displayName === "TabPanel"
          ) {
            const panelValue = (element.props as Record<string, unknown>)
              ?.value;
            if (
              typeof panelValue === "string" &&
              !valueToIndexMap.has(panelValue)
            ) {
              valueToIndexMap.set(panelValue, panelIndex);
              indexToValueMap.set(panelIndex, panelValue);
              panelIndex++;
            }
          }
          if ((element.props as Record<string, unknown>)?.children) {
            React.Children.forEach(
              (element.props as Record<string, unknown>)
                .children as React.ReactNode,
              scanForPanels,
            );
          }
        }
      };

      childrenArray.forEach(scanForPanels);
    }

    setIsRebuilding(false);

    return () => {
      valueToIndexMap.clear();
      indexToValueMap.clear();
    };
  }, [children, valueToIndexMap, indexToValueMap]);

  return (
    <TabsCarouselProvider value={contextValue}>
      <div
        className={carouselViewportStyle}
        ref={carouselState.carouselRef}
        {...carouselState.rootProps}
      >
        <div className={carouselContainerStyle}>{children}</div>
      </div>
    </TabsCarouselProvider>
  );
};

interface TabPanelPropsWithIndex extends TabPanelProps {
  index?: number;
}

const TabPanel = ({
  value,
  children,
  className,
  index,
}: TabPanelPropsWithIndex) => {
  const { value: selectedValue } = useTabsContext();
  const { tabPanelProps } = useTabPanel({ value }, selectedValue);
  const carouselContext = useTabsCarouselContext({ strict: false });

  useEffect(() => {
    if (index !== undefined) {
      if (carouselContext) {
        carouselContext.updateTabIndex(value, index);
      }
    } else if (carouselContext?.registerPanel) {
      carouselContext.registerPanel(value);
    }
  }, [value, index, carouselContext]);

  return (
    <div {...tabPanelProps} className={clsx(tabPanelStyle, className)}>
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
