import { EmptyNuguriStamp, FillNuguriStamp } from "@nugudi/assets-icons";
import { HStack, VStack } from "@nugudi/react-components-layout";
import { STAMP_LAYOUT } from "../../../constants/stamp";
import type { StampItem } from "../../../types/stamp";

interface StampCardProps {
  stamps: StampItem[];
}

export const StampCard = ({ stamps }: StampCardProps) => {
  const MAX_STAMPS = 5;
  const displayStamps = stamps.slice(0, MAX_STAMPS);

  const emptySlots = Math.max(0, MAX_STAMPS - displayStamps.length);
  const emptyStamps = Array(emptySlots).fill(null);

  const allStamps = [...displayStamps, ...emptyStamps];

  const row1 = allStamps.slice(0, 2);
  const row2 = allStamps.slice(2, 4);
  const row3 = allStamps.slice(4, 5);

  const renderStamp = (stamp: StampItem | null, index: number) => {
    if (!stamp) {
      return (
        <EmptyNuguriStamp
          key={`empty-${index}`}
          width={STAMP_LAYOUT.SIZE}
          height={STAMP_LAYOUT.SIZE}
        />
      );
    }

    if (stamp.isUsed) {
      return (
        <FillNuguriStamp
          key={stamp.id}
          width={STAMP_LAYOUT.SIZE}
          height={STAMP_LAYOUT.SIZE}
        />
      );
    }

    return (
      <EmptyNuguriStamp
        key={stamp.id}
        width={STAMP_LAYOUT.SIZE}
        height={STAMP_LAYOUT.SIZE}
      />
    );
  };

  return (
    <VStack align="center">
      <HStack justify="center" align="center" gap={STAMP_LAYOUT.GAP}>
        {row1.map((stamp, index) => renderStamp(stamp, index))}
      </HStack>

      <HStack justify="center" align="center" gap={STAMP_LAYOUT.GAP}>
        {row2.map((stamp, index) => renderStamp(stamp, index + 2))}
      </HStack>

      {row3.map((stamp, index) => renderStamp(stamp, index + 4))}
    </VStack>
  );
};
