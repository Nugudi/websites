import type * as React from "react";

export interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  className?: string;
  style?: React.CSSProperties;
}

export interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export interface TabProps {
  value: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export interface TabPanelProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

// Hook Types
export interface UseTabsProps {
  defaultValue?: string;
}

export interface UseTabsReturn {
  value: string;
  onChange: (value: string) => void;
}

export interface UseTabProps {
  value: string;
  disabled?: boolean;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  onClick?: () => void;
}

export interface UseTabReturn {
  tabProps: {
    role: "tab";
    id: string;
    "aria-selected": boolean;
    "aria-disabled"?: boolean;
    "aria-controls": string;
    tabIndex: number;
    onKeyDown: (event: React.KeyboardEvent) => void;
    onClick: () => void;
  };
  isSelected: boolean;
}

export interface UseTabPanelProps {
  value: string;
}

export interface UseTabPanelReturn {
  tabPanelProps: {
    role: "tabpanel";
    id: string;
    "aria-labelledby": string;
    tabIndex: number;
  };
  isActive: boolean;
}
