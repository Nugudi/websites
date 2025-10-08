import { VStack } from "@nugudi/react-components-layout";
import { CafeteriaHeroSection } from "../../sections/cafeteria-hero-section";
import { CafeteriaTabSection } from "../../sections/cafeteria-tab-section";

interface CafeteriaDetailViewProps {
  cafeteriaId: string;
}

export const CafeteriaDetailView = ({
  cafeteriaId,
}: CafeteriaDetailViewProps) => {
  return (
    <VStack gap={16} w="full">
      <CafeteriaHeroSection cafeteriaId={cafeteriaId} />
      <CafeteriaTabSection cafeteriaId={cafeteriaId} />
    </VStack>
  );
};
