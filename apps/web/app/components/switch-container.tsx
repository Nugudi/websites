"use client";

import { Flex } from "@nugudi/react-components-layout";
import { Switch } from "@nugudi/react-components-switch";
import { useToggle } from "@nugudi/react-hooks-toggle";

export const SwitchContainer = () => {
  const { toggle, isSelected } = useToggle({ isSelected: false });

  return (
    <Flex direction="column" gap={10}>
      <Switch
        isSelected={isSelected}
        onToggle={toggle}
        color="main"
        label={`스위치가 ${isSelected ? "켜짐" : "꺼짐"} 상태입니다`}
        labelPlacement="end"
        id="switch"
      />
      <Switch
        isSelected={isSelected}
        onToggle={toggle}
        color="zinc"
        label={`스위치가 ${isSelected ? "켜짐" : "꺼짐"} 상태입니다`}
        labelPlacement="start"
        id="switch2"
      />
    </Flex>
  );
};
