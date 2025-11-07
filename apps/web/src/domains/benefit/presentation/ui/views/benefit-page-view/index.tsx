import { VStack } from "@nugudi/react-components-layout";
import { AppHeader } from "@/src/shared/interface-adapters/components/app-header";
import { CafeteriaRecommendSection } from "@/src/shared/interface-adapters/sections/cafeteria-recommend-section";
import { BenefitMenuSection } from "../../sections/benefit-menu-section";
import * as styles from "./index.css";

export const BenefitPageView = () => {
  return (
    <VStack className={styles.container} pY={16} w="full" h="full" gap={16}>
      <VStack pX={16} gap={16}>
        <AppHeader />
        <CafeteriaRecommendSection />
      </VStack>
      <BenefitMenuSection />
    </VStack>
  );
};
