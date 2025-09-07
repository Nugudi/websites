import { Flex, VStack } from "@nugudi/react-components-layout";
import { StampWelcomeSection } from "@/src/domains/stamp/ui/sections/stamp-welcome-section";
import { AppHeader } from "@/src/shared/ui/components/app-header";
import { StampCollectionSection } from "../../sections/stamp-collection-section";
import * as styles from "./index.css";

export const StampView = () => {
  return (
    <Flex className={styles.container} direction="column" align="center">
      <AppHeader />
      <VStack mt={48}>
        <StampWelcomeSection />
      </VStack>
      <StampCollectionSection />
    </Flex>
  );
};
