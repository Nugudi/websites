import { AppHeader } from "@core/ui/components/app-header";
import { Flex, VStack } from "@nugudi/react-components-layout";
import { StampCollectionSection } from "../../sections/stamp-collection-section";
import { StampWelcomeSection } from "../../sections/stamp-welcome-section";
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
