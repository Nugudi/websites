import { VStack } from "@nugudi/react-components-layout";
import { AppHeader } from "@/src/shared/ui/components/app-header";
import { BenefitListSection } from "../../sections/benefit-list-section";
import { UserBenefitSection } from "../../sections/user-benefit-section";
import * as styles from "./index.css";

export const BenefitPageView = () => {
  return (
    <div className={styles.container}>
      <VStack gap="16px">
        <AppHeader />
        <UserBenefitSection />
        <BenefitListSection />
      </VStack>
    </div>
  );
};
