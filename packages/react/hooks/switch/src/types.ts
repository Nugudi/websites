import type { ComponentProps, HTMLAttributes } from "react";

export type SwitchElementType = "button" | "a" | "div" | "span" | "input";

export type BaseSwitchProps<T extends SwitchElementType = "button"> = {
  elementType?: T;
  role?: string;
  type?: "button" | "submit" | "reset";
  isDisabled?: boolean;
  isSelected?: boolean;
  tabIndex?: number;
  onToggle?: (isSelected: boolean) => void;
} & Omit<ComponentProps<T>, "onToggle">;

export type UseSwitchReturn<T> = {
  switchProps: HTMLAttributes<T> & {
    role?: string;
    type?: "button" | "submit" | "reset" | "checkbox";
    tabIndex?: number;
    disabled?: boolean;
    checked?: boolean;
    "aria-checked"?: boolean;
    "aria-disabled"?: boolean;
  };
};

export type OverloadedSwitchFunction = {
  (props: BaseSwitchProps<"button">): UseSwitchReturn<HTMLButtonElement>;
  (props: BaseSwitchProps<"a">): UseSwitchReturn<HTMLAnchorElement>;
  (props: BaseSwitchProps<"div">): UseSwitchReturn<HTMLDivElement>;
  (props: BaseSwitchProps<"input">): UseSwitchReturn<HTMLInputElement>;
  (props: BaseSwitchProps<"span">): UseSwitchReturn<HTMLSpanElement>;
};

export type UseToggleSwitchReturn<T> = UseSwitchReturn<T> & {
  isSelected: boolean;
};

export type OverloadedToggleSwitchFunction = {
  (
    props: BaseSwitchProps<"button">,
    defaultSelected?: boolean,
  ): UseToggleSwitchReturn<HTMLButtonElement>;
  (
    props: BaseSwitchProps<"a">,
    defaultSelected?: boolean,
  ): UseToggleSwitchReturn<HTMLAnchorElement>;
  (
    props: BaseSwitchProps<"div">,
    defaultSelected?: boolean,
  ): UseToggleSwitchReturn<HTMLDivElement>;
  (
    props: BaseSwitchProps<"input">,
    defaultSelected?: boolean,
  ): UseToggleSwitchReturn<HTMLInputElement>;
  (
    props: BaseSwitchProps<"span">,
    defaultSelected?: boolean,
  ): UseToggleSwitchReturn<HTMLSpanElement>;
};
