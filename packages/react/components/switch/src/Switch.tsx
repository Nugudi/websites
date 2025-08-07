import { useToggle } from "@nugudi/react-hooks-toggle";
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
    isDisabled = false,
    defaultSelected = false,
    isSelected: externalIsSelected,
    onToggle,
    style,
    className,
    label,
    labelPlacement,
    ...restProps
  } = props;

  const isControlledComponent = externalIsSelected !== undefined;
  const { isSelected: internalIsSelected, toggle: toggleInternalState } =
    useToggle({
      isSelected: isControlledComponent ? externalIsSelected : defaultSelected,
    });

  const currentIsSelected = isControlledComponent
    ? externalIsSelected
    : internalIsSelected;

  const handleSwitchClick = React.useCallback(() => {
    if (isDisabled) return;

    const nextSelectedState = !currentIsSelected;

    if (!isControlledComponent) {
      toggleInternalState();
    }

    onToggle?.(nextSelectedState);
  }, [
    isDisabled,
    isControlledComponent,
    toggleInternalState,
    onToggle,
    currentIsSelected,
  ]);

  const trackBackgroundColor = currentIsSelected
    ? vars.colors.$scale[color][500]
    : vars.colors.$scale.zinc[300];

  const thumbBackgroundColor = vars.colors.$scale.whiteAlpha[900];

  const switchButtonElement = (
    <button
      {...restProps}
      ref={ref}
      type="button"
      role="switch"
      aria-checked={currentIsSelected}
      disabled={isDisabled}
      onClick={handleSwitchClick}
      className={clsx([switchContainer({ size, isDisabled }), className])}
      style={{
        ...assignInlineVars({
          [backgroundColorVariant]: trackBackgroundColor,
          [thumbColorVariant]: thumbBackgroundColor,
        }),
        ...style,
      }}
    >
      <span className={switchTrack({ size })}>
        <span
          className={switchThumb({ size, isSelected: currentIsSelected })}
        />
      </span>
    </button>
  );

  if (!label) {
    return switchButtonElement;
  }

  const isLabelAtStart = labelPlacement === "start";
  const labelElement = <label htmlFor={restProps.id}>{label}</label>;

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
