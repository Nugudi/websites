import { useToggle } from "@nugudi/react-hooks-toggle";
import { vars } from "@nugudi/themes";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { clsx } from "clsx";
import * as React from "react";
import {
  backgroundColorVariant,
  labelText,
  labelWrapper,
  switchContainer,
  switchThumb,
  switchTrack,
  thumbColorVariant,
} from "./style.css";
import type { SwitchProps } from "./types";

const Switch = (props: SwitchProps, ref: React.Ref<HTMLButtonElement>) => {
  const {
    size = "md",
    color = "main",
    isDisabled = false,
    defaultSelected = false,
    isSelected: controlledSelected,
    onToggle,
    style,
    className,
    id,
    label,
    labelPlacement = "end",
    ...restProps
  } = props;

  const isControlled = controlledSelected !== undefined;
  const { isSelected, toggle } = useToggle({
    isSelected: isControlled ? controlledSelected : defaultSelected,
  });

  const handleClick = React.useCallback(() => {
    if (isDisabled) return;

    if (!isControlled) {
      toggle();
    }
    onToggle?.(!isSelected);
  }, [isDisabled, isControlled, toggle, onToggle, isSelected]);

  const backgroundColor = isSelected
    ? vars.colors.$scale[color][500]
    : vars.colors.$scale.zinc[300];

  const thumbColor = vars.colors.$scale.whiteAlpha[900];

  const switchButton = (
    <button
      {...restProps}
      ref={ref}
      id={id}
      type="button"
      role="switch"
      aria-checked={isSelected}
      disabled={isDisabled}
      onClick={handleClick}
      className={clsx([switchContainer({ size, isDisabled }), className])}
      style={{
        ...assignInlineVars({
          [backgroundColorVariant]: backgroundColor,
          [thumbColorVariant]: thumbColor,
        }),
        ...style,
      }}
    >
      <span className={switchTrack({ size })}>
        <span className={switchThumb({ size, isSelected })} />
      </span>
    </button>
  );

  if (!label) {
    return switchButton;
  }

  return (
    <label className={labelWrapper({ labelPlacement })} htmlFor={id}>
      {labelPlacement === "start" && (
        <span className={labelText({ size })}>{label}</span>
      )}
      {switchButton}
      {labelPlacement === "end" && (
        <span className={labelText({ size })}>{label}</span>
      )}
    </label>
  );
};

const _Switch = React.forwardRef(Switch);
export { _Switch as Switch };
