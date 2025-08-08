import { useToggle } from "@nugudi/react-hooks-toggle";
import type { OverloadedToggleSwitchFunction } from "./types";
import { useSwitch } from "./useSwitch";

export const useToggleSwitch: OverloadedToggleSwitchFunction = (
  props: any,
  defaultSelected?: boolean,
): any => {
  const isControlled = props.isSelected !== undefined;

  const { isSelected: _isSelected, toggle } = useToggle({
    isSelected: isControlled ? props.isSelected : defaultSelected,
  });

  const currentIsSelected = isControlled ? props.isSelected : _isSelected;

  const handleToggle = () => {
    if (!isControlled) {
      toggle();
    }
    props.onToggle?.(!currentIsSelected);
  };

  const { switchProps } = useSwitch({
    ...props,
    isSelected: currentIsSelected,
    onToggle: handleToggle,
  });

  return {
    switchProps,
    isSelected: currentIsSelected,
  };
};
