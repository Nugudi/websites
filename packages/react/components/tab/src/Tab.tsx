import { clsx } from "clsx";
import * as React from "react";
import {
  tabListStyle,
  tabPanelStyle,
  tabStyle,
  tabsContainerStyle,
} from "./style.css";
import { TabsProvider, useTabsContext } from "./TabsContext";
import type { TabListProps, TabPanelProps, TabProps, TabsProps } from "./types";
import { useTab, useTabPanel, useTabs } from "./useTab";

const Tabs = ({
  items = [],
  children,
  defaultValue,
  size = "full",
  className,
  style,
}: TabsProps) => {
  const { value, onChange: handleChange } = useTabs({
    defaultValue: defaultValue || items[0]?.id,
  });

  const contextValue = React.useMemo(
    () => ({
      value,
      onChange: handleChange,
      size,
    }),
    [value, handleChange, size],
  );

  return (
    <TabsProvider value={contextValue}>
      <div className={clsx(tabsContainerStyle, className)} style={style}>
        {children ? (
          children
        ) : (
          <>
            <TabList>
              {items.map((item) => (
                <Tab key={item.id} value={item.id} disabled={item.disabled}>
                  {item.label}
                </Tab>
              ))}
            </TabList>
            {items.map((item) => (
              <TabPanel key={item.id} value={item.id}>
                {item.content}
              </TabPanel>
            ))}
          </>
        )}
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
  const { value: selectedValue, onChange, size } = useTabsContext();
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
          size,
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
  const { value: selectedValue } = useTabsContext();
  const { tabPanelProps, isActive } = useTabPanel({ value }, selectedValue);

  if (!isActive) return null;

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
