"use client";

import { Tabs } from "@nugudi/react-components-tab";
import { getMockCafeteriaData } from "../../../mocks/cafeteria-mock-data";
import { CafeteriaInfoTab } from "../../components/cafeteria-info-tab";
import { CafeteriaMenuTab } from "../../components/cafeteria-menu-tab";

interface CafeteriaTabSectionProps {
  cafeteriaId: string;
}

export const CafeteriaTabSection = ({
  cafeteriaId,
}: CafeteriaTabSectionProps) => {
  const cafeteriaData = getMockCafeteriaData();

  if (!cafeteriaData || !cafeteriaData.cafeteria) {
    return null;
  }

  return (
    <Tabs defaultValue="info" scrollOffset={42}>
      <Tabs.List>
        <Tabs.Item value="info">식당 정보</Tabs.Item>
        <Tabs.Item value="menu">식단표</Tabs.Item>
      </Tabs.List>

      <Tabs.Panel value="info">
        <CafeteriaInfoTab cafeteriaId={cafeteriaId} />
      </Tabs.Panel>

      <Tabs.Panel value="menu">
        <CafeteriaMenuTab
          cafeteria={cafeteriaData.cafeteria}
          cafeteriaId={cafeteriaId}
        />
      </Tabs.Panel>
    </Tabs>
  );
};
