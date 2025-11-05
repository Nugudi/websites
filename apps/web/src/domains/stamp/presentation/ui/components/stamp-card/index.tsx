import {
  EmptyBusStamp,
  EmptyNuguriStamp,
  FillNuguriStamp,
} from "@nugudi/assets-icons";
import { HStack, VStack } from "@nugudi/react-components-layout";

import { STAMP_LAYOUT } from "../../../constants/stamp";

export const StampCard = () => {
  return (
    <VStack align="center">
      <HStack justify="center" align="center" gap={STAMP_LAYOUT.GAP}>
        <FillNuguriStamp width={STAMP_LAYOUT.SIZE} height={STAMP_LAYOUT.SIZE} />
        <EmptyBusStamp width={STAMP_LAYOUT.SIZE} height={STAMP_LAYOUT.SIZE} />
      </HStack>
      <HStack justify="center" align="center" gap={STAMP_LAYOUT.GAP}>
        <EmptyBusStamp width={STAMP_LAYOUT.SIZE} height={STAMP_LAYOUT.SIZE} />
        <EmptyNuguriStamp
          width={STAMP_LAYOUT.SIZE}
          height={STAMP_LAYOUT.SIZE}
        />
      </HStack>
      <EmptyNuguriStamp width={STAMP_LAYOUT.SIZE} height={STAMP_LAYOUT.SIZE} />
    </VStack>
  );
};
