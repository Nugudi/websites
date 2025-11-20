"use client";

import { useGetCafeteriaDetail } from "@cafeteria/presentation/client/hooks/queries/get-cafeteria-detail.query";
import { VStack } from "@nugudi/react-components-layout";
import Image from "next/image";
import { CafeteriaInfoCard } from "../../components/cafeteria-info-card";
import * as styles from "./index.css";

interface CafeteriaHeroSectionProps {
  cafeteriaId: string;
}

export const CafeteriaHeroSection = ({
  cafeteriaId,
}: CafeteriaHeroSectionProps) => {
  const { data: cafeteria } = useGetCafeteriaDetail(cafeteriaId);

  return (
    <VStack width="full">
      <HeroImage cafeteriaName={cafeteria.name} />
      <CafeteriaInfoCard cafeteria={cafeteria} />
    </VStack>
  );
};

interface HeroImageProps {
  cafeteriaName: string;
}

const HeroImage = ({ cafeteriaName }: HeroImageProps) => {
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
