import type { BaseSwitchProps, OverloadedSwitchFunction } from "./types";

export const useSwitch: OverloadedSwitchFunction = (props: any): any => {
  const {
    elementType = "button",
    isDisabled,
    tabIndex,
    onKeyDown,
    type = "button",
    isSelected,
    onToggle,
    onClick,
    ...restProps
  } = props;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    onKeyDown?.(event);

    if (event.key === " " || event.key === "Spacebar" || event.key === "32") {
      if (isDisabled) return;
      if (event.defaultPrevented) return;
      if (elementType === "button") return;

      event.preventDefault();
      (event.currentTarget as HTMLElement).click();

      return;
    }

    if (event.key === "Enter" || event.key === "13") {
      if (isDisabled) return;
      if (event.defaultPrevented) return;
      if (elementType === "input" && type !== "button") return;

      event.preventDefault();
      (event.currentTarget as HTMLElement).click();

      return;
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    if (isDisabled) return;
    onToggle?.();
    onClick?.(event);
  };

  const baseProps = {
    ...restProps,
    tabIndex: isDisabled ? undefined : (tabIndex ?? 0),
    onKeyDown: handleKeyDown,
    onClick: handleClick,
    "aria-checked": isSelected,
    "aria-disabled": isDisabled,
  };

  let additionalProps = {};

  switch (elementType) {
    case "button": {
      additionalProps = {
        type: type ?? "button",
        disabled: isDisabled,
        role: "switch",
      };
      break;
    }
    case "a": {
      const { href, target, rel } = props as BaseSwitchProps<"a">;

      additionalProps = {
        role: "switch",
        href: isDisabled ? undefined : href,
        target: isDisabled ? undefined : target,
        rel: isDisabled ? undefined : rel,
      };
      break;
    }
    case "input": {
      additionalProps = {
        role: "switch",
        type: props.type ?? "checkbox",
        disabled: isDisabled,
        checked: isSelected,
      };
      break;
    }
    default: {
      additionalProps = {
        role: "switch",
      };
      break;
    }
  }

  const switchProps = {
    ...baseProps,
    ...additionalProps,
  };

  return {
    switchProps,
  };
};
