"use client";

import { Backdrop } from "@nugudi/react-components-backdrop";
import { VStack } from "@nugudi/react-components-layout";
import { Tabs } from "@nugudi/react-components-tab";
import { useState } from "react";
import { getMockCafeteriaData } from "../../../mocks/cafeteria-mock-data";
import { CafeteriaInfoTab } from "../../components/cafeteria-info-tab";
import { CafeteriaMenuBottomSheet } from "../../components/cafeteria-menu-bottom-sheet";
import { CafeteriaReviewTab } from "../../components/cafeteria-review-tab";
import { CafeteriaReviewTabControls } from "../../components/cafeteria-review-tab-controls";

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
            <CafeteriaReviewTabControls
              onMenuClick={() => setIsMenuSheetOpen(true)}
              onDateClick={() => {
                // TODO: 캘린더
              }}
            />
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
