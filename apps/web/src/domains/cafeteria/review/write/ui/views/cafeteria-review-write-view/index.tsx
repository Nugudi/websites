import { Flex } from "@nugudi/react-components-layout";
import { NavBar } from "@/src/shared/interface-adapters/components/nav-bar";
import { CafeteriaReviewInfoSection } from "../../sections/cafeteria-review-info-section";
import { CafeteriaReviewWriteSection } from "../../sections/cafeteria-review-write-section";
import * as styles from "./index.css";

interface CafeteriaReviewWriteViewProps {
  cafeteriaId: string;
  cafeteriaName: string;
}

export const CafeteriaReviewWriteView = ({
  cafeteriaId,
  cafeteriaName,
}: CafeteriaReviewWriteViewProps) => {
  return (
    <Flex
      direction="column"
      w="full"
      p={16}
      gap={16}
      className={styles.container}
    >
      <NavBar />
      <CafeteriaReviewInfoSection cafeteriaName={cafeteriaName} />
      <CafeteriaReviewWriteSection cafeteriaId={cafeteriaId} />
    </Flex>
  );
};
