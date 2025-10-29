import { BottomSheet } from "@nugudi/react-components-bottom-sheet";
import { Button } from "@nugudi/react-components-button";
import { VStack } from "@nugudi/react-components-layout";
import type { MenuItem } from "@nugudi/react-components-menu-card";
import { MenuCard } from "@nugudi/react-components-menu-card";

interface CafeteriaMenuBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  menus: MenuItem[];
}

export const CafeteriaMenuBottomSheet = ({
  isOpen,
  onClose,
  menus,
}: CafeteriaMenuBottomSheetProps) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} snapPoints={[70]}>
      <VStack justify="space-between" gap={16}>
        <MenuCard
          title="오늘의 메뉴"
          subtitle="중식"
          timeRange="오전 11시 30분 ~ 오후 2시"
          items={menus}
          isPackagingAvailable={true}
        />
        <Button
          variant="brand"
          color="zinc"
          size="lg"
          width="full"
          onClick={onClose}
        >
          닫기
        </Button>
      </VStack>
    </BottomSheet>
  );
};
