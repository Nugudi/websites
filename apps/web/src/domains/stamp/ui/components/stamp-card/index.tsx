import {
  EmptyBusStamp,
  EmptyNuguriStamp,
  FillNuguriStamp,
} from "@nugudi/assets-icons";
import { HStack, VStack } from "@nugudi/react-components-layout";

import { STAMP_ICON } from "@/src/domains/stamp/constants/stamp";

export const StampCard = () => {
  return (
    <VStack align="center">
      <HStack justify="center" align="center" gap={STAMP_ICON.GAP}>
        <FillNuguriStamp width={STAMP_ICON.SIZE} height={STAMP_ICON.SIZE} />
        <EmptyBusStamp width={STAMP_ICON.SIZE} height={STAMP_ICON.SIZE} />
      </HStack>
      <HStack justify="center" align="center" gap={STAMP_ICON.GAP}>
        <EmptyBusStamp width={STAMP_ICON.SIZE} height={STAMP_ICON.SIZE} />
        <EmptyNuguriStamp width={STAMP_ICON.SIZE} height={STAMP_ICON.SIZE} />
      </HStack>
      <EmptyNuguriStamp width={STAMP_ICON.SIZE} height={STAMP_ICON.SIZE} />
    </VStack>
  );
};
