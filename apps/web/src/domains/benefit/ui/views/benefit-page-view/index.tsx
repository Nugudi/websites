import { Box, VStack } from "@nugudi/react-components-layout";
import { AppHeader } from "@/src/shared/ui/components/app-header";
import { BenefitHighlightSection } from "../../sections/benefit-highlight-section";
import { BenefitMenuSection } from "../../sections/benefit-menu-section";
import * as styles from "./index.css";

export const BenefitPageView = () => {
  return (
    <Box className={styles.container} p={16} w="full">
      <VStack gap={16}>
        <AppHeader />
        <BenefitHighlightSection />
        <BenefitMenuSection />
      </VStack>
    </Box>
  );
};
