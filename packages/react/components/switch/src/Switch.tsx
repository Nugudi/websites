import { useToggleSwitch } from "@nugudi/react-hooks-switch";
import { vars } from "@nugudi/themes";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { clsx } from "clsx";
import * as React from "react";
import {
  backgroundColorVariant,
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
    label,
    labelPlacement,
    style,
    className,
    defaultSelected = false,
    ...restProps
  } = props;

  const { switchProps, isSelected } = useToggleSwitch(
    { ...restProps, elementType: "button" },
    defaultSelected,
  );

  const trackBackgroundColor = isSelected
    ? vars.colors.$scale[color][500]
    : vars.colors.$scale.zinc[300];

  const thumbBackgroundColor = vars.colors.$scale.whiteAlpha[900];

  const switchId = props.id;

  const switchButtonElement = (
    <button
      {...switchProps}
      id={switchId}
      type={"button"}
      ref={ref}
      className={clsx([
        switchContainer({ size, isDisabled: switchProps.disabled }),
        className,
      ])}
      style={{
        ...assignInlineVars({
          [backgroundColorVariant]: trackBackgroundColor,
          [thumbColorVariant]: thumbBackgroundColor,
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
    return switchButtonElement;
  }

  const isLabelAtStart = labelPlacement === "start";
  const labelElement = <label htmlFor={switchId}>{label}</label>;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {isLabelAtStart && labelElement}
      {switchButtonElement}
      {!isLabelAtStart && labelElement}
    </div>
  );
};

const _Switch = React.forwardRef(Switch);
export { _Switch as Switch };
