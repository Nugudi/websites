"use client";

import { CalendarIcon, FolderIcon } from "@nugudi/assets-icons";
import { Backdrop } from "@nugudi/react-components-backdrop";
import { Chip } from "@nugudi/react-components-chip";
import { HStack, VStack } from "@nugudi/react-components-layout";
import { Tabs } from "@nugudi/react-components-tab";
import { useState } from "react";
import { getMockCafeteriaData } from "../../../constants/mock-data";
import { CafeteriaInfoTab } from "../../components/cafeteria-info-tab";
import { CafeteriaMenuBottomSheet } from "../../components/cafeteria-menu-bottom-sheet";
import { CafeteriaReviewTab } from "../../components/cafeteria-review-tab";

interface CafeteriaTabSectionProps {
  cafeteriaId: string;
}

export const CafeteriaTabSection = ({
  cafeteriaId,
}: CafeteriaTabSectionProps) => {
  const [isMenuSheetOpen, setIsMenuSheetOpen] = useState(false);
  const cafeteria = getMockCafeteriaData(cafeteriaId);

  return (
    <>
      <Tabs defaultValue="info">
        <VStack gap={16}>
          <Tabs.List>
            <Tabs.Item value="info">식당 정보</Tabs.Item>
            <Tabs.Item value="review">리뷰</Tabs.Item>
          </Tabs.List>
        </VStack>

        <Tabs.Panel value="info">
          <CafeteriaInfoTab cafeteriaId={cafeteriaId} />
        </Tabs.Panel>

        <Tabs.Panel value="review">
          <VStack gap={8} pY={16}>
            <HStack gap={8} justify="end">
              <Chip
                label="메뉴 확인"
                icon={<FolderIcon width={16} height={16} />}
                size="md"
                onClick={() => setIsMenuSheetOpen(true)}
              />
              <Chip
                label="날짜 선택"
                icon={<CalendarIcon width={16} height={16} />}
                size="md"
              />
            </HStack>
            <CafeteriaReviewTab />
          </VStack>
        </Tabs.Panel>
      </Tabs>

      {isMenuSheetOpen && (
        <Backdrop onClick={() => setIsMenuSheetOpen(false)} />
      )}
      <CafeteriaMenuBottomSheet
        isOpen={isMenuSheetOpen}
        onClose={() => setIsMenuSheetOpen(false)}
        menus={cafeteria.menus.lunch}
      />
    </>
  );
};
