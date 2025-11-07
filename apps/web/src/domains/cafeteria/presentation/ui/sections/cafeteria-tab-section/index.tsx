"use client";

import { Tabs } from "@nugudi/react-components-tab";
import { useQuery } from "@tanstack/react-query";
import { getCafeteriaClientContainer } from "../../../../di/cafeteria-client-container";
import { CafeteriaAdapter } from "../../../adapters";
import { CafeteriaInfoTab } from "../../components/cafeteria-info-tab";
import { CafeteriaMenuTab } from "../../components/cafeteria-menu-tab";

interface CafeteriaTabSectionProps {
  cafeteriaId: string;
}

export const CafeteriaTabSection = ({
  cafeteriaId,
}: CafeteriaTabSectionProps) => {
  const container = getCafeteriaClientContainer();
  const getCafeteriaByIdUseCase = container.getGetCafeteriaById();

  const {
    data: cafeteria,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cafeteria", "detail", cafeteriaId],
    queryFn: async () => {
      const entity = await getCafeteriaByIdUseCase.execute(cafeteriaId);
      return CafeteriaAdapter.toUiDetailItem(entity);
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  if (isLoading) {
    return <div>Loading tabs...</div>;
  }

  if (isError || !cafeteria) {
    return null;
  }

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
