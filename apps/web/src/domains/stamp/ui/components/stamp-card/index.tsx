import {
  EmptyBusStamp,
  EmptyNuguriStamp,
  FillNuguriStamp,
} from "@nugudi/assets-icons";
import { HStack, VStack } from "@nugudi/react-components-layout";
import * as styles from "./index.css";

export const StampCard = () => {
  return (
    <VStack className={styles.container} align="center">
      <HStack justify="center" align="center" gap={80}>
        <FillNuguriStamp width={200} height={200} />
        <EmptyBusStamp width={200} height={200} />
      </HStack>
      <HStack justify="center" align="center" gap={80}>
        <EmptyBusStamp width={200} height={200} />
        <EmptyNuguriStamp width={200} height={200} />
      </HStack>
      <EmptyNuguriStamp width={200} height={200} />
    </VStack>
  );
};
