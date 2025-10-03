"use client";

import { VStack } from "@nugudi/react-components-layout";
import Image from "next/image";
import { getMockCafeteriaData } from "../../../constants/mock-data";
import { CafeteriaInfoCard } from "../../components/cafeteria-info-card";
import * as styles from "./index.css";

interface CafeteriaHeroSectionProps {
  cafeteriaId: string;
}

export const CafeteriaHeroSection = ({
  cafeteriaId,
}: CafeteriaHeroSectionProps) => {
  const cafeteria = getMockCafeteriaData(cafeteriaId);

  return (
    <VStack width="full">
      <HeroImage cafeteriaName={cafeteria.name} />
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
      loading="lazy"
    />
  );
};
