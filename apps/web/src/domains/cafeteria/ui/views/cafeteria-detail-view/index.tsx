import { VStack } from "@nugudi/react-components-layout";
import { NavBar } from "@/src/shared/interface-adapters/components/nav-bar";
import { CafeteriaHeroSection } from "../../sections/cafeteria-hero-section";
import { CafeteriaTabSection } from "../../sections/cafeteria-tab-section";

interface CafeteriaDetailViewProps {
  cafeteriaId: string;
}

export const CafeteriaDetailView = ({
  cafeteriaId,
}: CafeteriaDetailViewProps) => {
  return (
    <VStack w="full">
      <NavBar />
      <VStack gap={16} w="full">
        <CafeteriaHeroSection cafeteriaId={cafeteriaId} />
        <CafeteriaTabSection cafeteriaId={cafeteriaId} />
      </VStack>
    </VStack>
  );
};
