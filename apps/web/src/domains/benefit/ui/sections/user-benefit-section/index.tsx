import { HStack } from "@nugudi/react-components-layout";
import { BenefitCard } from "../../components/benefit-card";

export const UserBenefitSection = () => {
  return (
    <HStack gap="16px">
      <BenefitCard />
      <BenefitCard />
    </HStack>
  );
};
