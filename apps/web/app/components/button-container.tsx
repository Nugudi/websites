"use client";

import { Button } from "@nugudi/react-components-button";
import { useToggleButton } from "@nugudi/react-hooks-button";

export const ButtonContainer = () => {
  const { buttonProps, isSelected } = useToggleButton({
    onClick: () => {
      console.log("토글됨!", isSelected);
    },
  });

  return (
    <Button
      {...buttonProps}
      aria-pressed={isSelected}
      color="zinc"
      variant={isSelected ? "brand" : "neutral"}
    >
      {isSelected ? "❤️ 좋아요 취소" : "🤍 좋아요"}
    </Button>
  );
};
