import { EmptyNuguriStamp, FillNuguriStamp } from "@nugudi/assets-icons";
import { HStack, VStack } from "@nugudi/react-components-layout";
import { STAMP_LAYOUT } from "../../../constants/stamp";
import type { StampItem } from "../../../types/stamp";

interface StampCardProps {
  stamps: StampItem[];
}

export const StampCard = ({ stamps }: StampCardProps) => {
  // 최대 5개의 스탬프만 표시 (2-2-1 레이아웃)
  const MAX_STAMPS = 5;
  const displayStamps = stamps.slice(0, MAX_STAMPS);

  // 부족한 슬롯은 빈 스탬프로 채움
  const emptySlots = Math.max(0, MAX_STAMPS - displayStamps.length);
  const emptyStamps = Array(emptySlots).fill(null);

  // 모든 스탬프를 하나의 배열로 합침
  const allStamps = [...displayStamps, ...emptyStamps];

  // 스탬프를 행으로 분할 (2-2-1 패턴)
  const row1 = allStamps.slice(0, 2);
  const row2 = allStamps.slice(2, 4);
  const row3 = allStamps.slice(4, 5);

  // 스탬프 렌더링 헬퍼
  const renderStamp = (stamp: StampItem | null, index: number) => {
    if (!stamp) {
      // 빈 슬롯 - EmptyNuguriStamp 표시
      return (
        <EmptyNuguriStamp
          key={`empty-${index}`}
          width={STAMP_LAYOUT.SIZE}
          height={STAMP_LAYOUT.SIZE}
        />
      );
    }

    // 사용된 스탬프 - FillNuguriStamp
    if (stamp.isUsed) {
      return (
        <FillNuguriStamp
          key={stamp.id}
          width={STAMP_LAYOUT.SIZE}
          height={STAMP_LAYOUT.SIZE}
        />
      );
    }

    // 미사용 스탬프 - EmptyNuguriStamp
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
      {/* Row 1: 2 stamps */}
      <HStack justify="center" align="center" gap={STAMP_LAYOUT.GAP}>
        {row1.map((stamp, index) => renderStamp(stamp, index))}
      </HStack>

      {/* Row 2: 2 stamps */}
      <HStack justify="center" align="center" gap={STAMP_LAYOUT.GAP}>
        {row2.map((stamp, index) => renderStamp(stamp, index + 2))}
      </HStack>

      {/* Row 3: 1 stamp (centered) */}
      {row3.map((stamp, index) => renderStamp(stamp, index + 4))}
    </VStack>
  );
};
