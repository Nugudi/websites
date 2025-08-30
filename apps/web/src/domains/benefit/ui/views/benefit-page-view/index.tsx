import { VStack } from "@nugudi/react-components-layout";
import { AppHeader } from "@/src/shared/ui/components/app-header";
import { BenefitHighlightSection } from "../../sections/benefit-highlight-section";
import { BenefitMenuSection } from "../../sections/benefit-menu-section";
import * as styles from "./index.css";

export const BenefitPageView = () => {
  return (
    <div className={styles.container}>
      <VStack gap="16px">
        <AppHeader />
        <BenefitHighlightSection />
        <BenefitMenuSection />
      </VStack>
    </div>
  );
};
