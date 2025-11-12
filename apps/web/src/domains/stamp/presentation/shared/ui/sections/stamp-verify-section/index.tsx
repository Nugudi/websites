import { VStack } from "@nugudi/react-components-layout";
import { StampVerifyForm } from "../../components/stamp-verify-form";
import { StampVerifyHeader } from "../../components/stamp-verify-header";

export const StampVerifySection = () => {
  return (
    <VStack p={16}>
      <StampVerifyHeader />
      <StampVerifyForm />
    </VStack>
  );
};
