import { MealCompleteStamp } from "@nugudi/assets-icons";
import { VStack } from "@nugudi/react-components-layout";
import { StampWelcomeText } from "../../components/stamp-welcome-text";

export const StampWelcomeSection = () => {
  return (
    <VStack gap={48}>
      <StampWelcomeText />
      <MealCompleteStamp width={240} height={240} />
    </VStack>
  );
};
