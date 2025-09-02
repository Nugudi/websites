import { Flex } from "@nugudi/react-components-layout";
import { NavBar } from "@/src/shared/ui/components/nav-bar";
import { ReviewInfoSection } from "../../sections/review-info-section";
import { ReviewWriteSection } from "../../sections/review-write-section";
import * as styles from "./index.css";

interface ReviewWriteViewProps {
  cafeteriaId: string;
  cafeteriaName: string;
}

export const ReviewWriteView = ({
  cafeteriaId,
  cafeteriaName,
}: ReviewWriteViewProps) => {
  return (
    <Flex
      direction="column"
      w="full"
      p={16}
      gap={16}
      className={styles.container}
    >
      <NavBar />
      <ReviewInfoSection cafeteriaName={cafeteriaName} />
      <ReviewWriteSection cafeteriaId={cafeteriaId} />
    </Flex>
  );
};
