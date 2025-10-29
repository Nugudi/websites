"use client";

import { Backdrop } from "@nugudi/react-components-backdrop";
import { Tabs } from "@nugudi/react-components-tab";
import { useState } from "react";
import { getMockCafeteriaData } from "../../../mocks/cafeteria-mock-data";
import { CafeteriaInfoTab } from "../../components/cafeteria-info-tab";
import { CafeteriaMenuBottomSheet } from "../../components/cafeteria-menu-bottom-sheet";
import { CafeteriaMenuTab } from "../../components/cafeteria-menu-tab";

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
      <Tabs defaultValue="info" scrollOffset={42}>
        <Tabs.List>
          <Tabs.Item value="info">식당 정보</Tabs.Item>
          <Tabs.Item value="menu">식단표</Tabs.Item>
        </Tabs.List>

        <Tabs.Panel value="info">
          <CafeteriaInfoTab cafeteriaId={cafeteriaId} />
        </Tabs.Panel>

        <Tabs.Panel value="menu">
          <CafeteriaMenuTab cafeteria={cafeteria} cafeteriaId={cafeteriaId} />
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
