import { VStack } from "@nugudi/react-components-layout";
import { CafeteriaHeroSection } from "../../sections/cafeteria-hero-section";
import { CafeteriaTabSection } from "../../sections/cafeteria-tab-section";
import * as styles from "./index.css";

interface CafeteriaDetailViewProps {
  cafeteriaId: string;
}

export const CafeteriaDetailView = ({
  cafeteriaId,
}: CafeteriaDetailViewProps) => {
  return (
    <VStack gap={24} className={styles.viewContainer}>
      <CafeteriaHeroSection cafeteriaId={cafeteriaId} />
      <CafeteriaTabSection cafeteriaId={cafeteriaId} />
    </VStack>
  );
};
