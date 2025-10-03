"use client";

import { CalendarIcon, FolderIcon } from "@nugudi/assets-icons";
import { Chip } from "@nugudi/react-components-chip";
import { HStack } from "@nugudi/react-components-layout";

interface CafeteriaReviewTabControlsProps {
  onMenuClick: () => void;
  onDateClick: () => void;
}

export const CafeteriaReviewTabControls = ({
  onMenuClick,
  onDateClick,
}: CafeteriaReviewTabControlsProps) => {
  return (
    <HStack gap={8} justify="end">
      <Chip
        label="메뉴 확인"
        icon={<FolderIcon width={16} height={16} />}
        size="md"
        onClick={onMenuClick}
      />
      <Chip
        label="날짜 선택"
        icon={<CalendarIcon width={16} height={16} />}
        size="md"
        onClick={onDateClick}
      />
    </HStack>
  );
};
