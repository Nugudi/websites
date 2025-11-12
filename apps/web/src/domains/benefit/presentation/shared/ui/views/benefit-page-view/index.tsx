import { CafeteriaRecommendSection } from "@cafeteria/presentation";
import { AppHeader } from "@core/ui/components/app-header";
import { VStack } from "@nugudi/react-components-layout";
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
