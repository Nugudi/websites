import * as React from "react";
import type {
  UseTabPanelProps,
  UseTabPanelReturn,
  UseTabProps,
  UseTabReturn,
  UseTabsProps,
  UseTabsReturn,
} from "./types";

export const useTabs = (props: UseTabsProps): UseTabsReturn => {
  const { defaultValue } = props;
  const [value, setValue] = React.useState(defaultValue || "");

  return {
    value,
    onChange: setValue,
  };
};

export const useTab = (
  props: UseTabProps,
  selectedValue: string,
  onChange: (value: string) => void,
): UseTabReturn => {
  const { value, disabled, onKeyDown, onClick } = props;
  const isSelected = selectedValue === value;

  const handleClick = React.useCallback(() => {
    if (!disabled) {
      onChange(value);
      onClick?.();
    }
  }, [disabled, onChange, value, onClick]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      onKeyDown?.(event);

      if (event.key === " " || event.key === "Enter") {
        if (disabled) return;
        if (event.defaultPrevented) return;

        event.preventDefault();
        handleClick();
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const tabList = event.currentTarget.parentElement;
        if (!tabList) return;

        const tabs = Array.from(
          tabList.querySelectorAll('[role="tab"]:not([aria-disabled="true"])'),
        ) as HTMLElement[];

        const currentIndex = tabs.indexOf(event.currentTarget as HTMLElement);
        let nextIndex: number;

        if (event.key === "ArrowLeft") {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        } else {
          nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        }

        tabs[nextIndex]?.focus();
        tabs[nextIndex]?.click();
      }
    },
    [onKeyDown, disabled, handleClick],
  );

  // 탭 버튼에 적용할 모든 props (접근성 포함)
  const tabProps = React.useMemo(
    () => ({
      role: "tab" as const,
      "aria-selected": isSelected,
      "aria-disabled": disabled,
      tabIndex: isSelected ? 0 : -1,
      onKeyDown: handleKeyDown,
      onClick: handleClick,
    }),
    [isSelected, disabled, handleKeyDown, handleClick],
  );

  return {
    tabProps,
    isSelected,
  };
};

export const useTabPanel = (
  props: UseTabPanelProps,
  selectedValue: string,
): UseTabPanelReturn => {
  const { value } = props;
  const isActive = selectedValue === value;

  const tabPanelProps = React.useMemo(
    () => ({
      role: "tabpanel" as const,
      tabIndex: 0,
    }),
    [],
  );

  return {
    tabPanelProps,
    isActive,
  };
};
