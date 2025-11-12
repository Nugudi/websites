"use client";

import { CafeteriaAdapter } from "@cafeteria/presentation/shared/adapters";
import { VStack } from "@nugudi/react-components-layout";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getCafeteriaClientContainer } from "@/src/domains/cafeteria/di/cafeteria-client-container";
import { CafeteriaInfoCard } from "../../components/cafeteria-info-card";
import * as styles from "./index.css";

interface CafeteriaHeroSectionProps {
  cafeteriaId: string;
}

export const CafeteriaHeroSection = ({
  cafeteriaId,
}: CafeteriaHeroSectionProps) => {
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
    return (
      <VStack width="full">
        <HeroImage cafeteriaName="로딩 중..." />
        <div>Loading...</div>
      </VStack>
    );
  }

  if (isError || !cafeteria) {
    return null;
  }

  return (
    <VStack width="full">
      <HeroImage cafeteriaName={cafeteria.name || ""} />
      <CafeteriaInfoCard cafeteria={cafeteria} />
    </VStack>
  );
};

const HeroImage = ({ cafeteriaName }: { cafeteriaName: string }) => {
  return (
    <Image
      src="/images/cafeterias-test.png"
      alt={`${cafeteriaName} 식당 이미지`}
      width={500}
      height={240}
      className={styles.backgroundImage}
      priority
    />
  );
};
