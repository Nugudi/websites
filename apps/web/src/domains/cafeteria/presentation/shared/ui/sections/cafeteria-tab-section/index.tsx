"use client";

import { useGetCafeteriaDetail } from "@cafeteria/presentation/client/hooks/queries/get-cafeteria-detail.query";
import { Tabs } from "@nugudi/react-components-tab";
import { CafeteriaInfoTab } from "../../components/cafeteria-info-tab";
import { CafeteriaMenuTab } from "../../components/cafeteria-menu-tab";

interface CafeteriaTabSectionProps {
  cafeteriaId: string;
}

export const CafeteriaTabSection = ({
  cafeteriaId,
}: CafeteriaTabSectionProps) => {
  const { data: cafeteria } = useGetCafeteriaDetail(cafeteriaId);

  return (
    <Tabs defaultValue="info" scrollOffset={42}>
      <Tabs.List>
        <Tabs.Item value="info">식당 정보</Tabs.Item>
        <Tabs.Item value="menu">식단표</Tabs.Item>
      </Tabs.List>

      <Tabs.Panel value="info">
        <CafeteriaInfoTab cafeteria={cafeteria} />
      </Tabs.Panel>

      <Tabs.Panel value="menu">
        <CafeteriaMenuTab cafeteria={cafeteria} cafeteriaId={cafeteriaId} />
      </Tabs.Panel>
    </Tabs>
  );
};
