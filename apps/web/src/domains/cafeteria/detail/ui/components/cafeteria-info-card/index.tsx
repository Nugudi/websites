import { FillStarIcon, HeartIcon, ShareIcon } from "@nugudi/assets-icons";
import {
  Body,
  Box,
  Divider,
  HStack,
  Title,
  VStack,
} from "@nugudi/react-components-layout";
import { vars } from "@nugudi/themes";
import type { CafeteriaDetail } from "../../../types/cafeteria-detail";
import * as styles from "./index.css";

interface CafeteriaInfoCardProps {
  cafeteria: CafeteriaDetail;
}

export const CafeteriaInfoCard = ({ cafeteria }: CafeteriaInfoCardProps) => {
  return (
    <Box className={styles.infoCard} marginTop={-64} mX={16}>
      <VStack align="center" gap={16} padding={24}>
        <VStack gap={8} align="center" width="100%">
          {cafeteria.isPackagingAvailable && <PackagingAvailableNotice />}
          <CafeteriaNameWithActions name={cafeteria.name} />
          <RatingAndReviewCountInfo
            rating={cafeteria.rating}
            reviewCount={cafeteria.reviewCount}
          />
          <Divider />
          <LocationInfo address={cafeteria.location} />
        </VStack>
      </VStack>
    </Box>
  );
};

const PackagingAvailableNotice = () => {
  return (
    <Body fontSize="b4" colorShade={600}>
      해당 매장은 <span className={styles.emphasisText}>포장</span>이 가능해요
    </Body>
  );
};

interface CafeteriaNameWithActionsProps {
  name: string;
}

const CafeteriaNameWithActions = ({ name }: CafeteriaNameWithActionsProps) => {
  return (
    <HStack align="center" gap={12}>
      <Title fontSize="t2" className={styles.nameText}>
        {name}
      </Title>
      <ActionButtons />
    </HStack>
  );
};

const ActionButtons = () => {
  return (
    <HStack gap={8}>
      <HeartIcon width={20} height={20} />
      <ShareIcon width={20} height={20} />
    </HStack>
  );
};

interface LocationInfoProps {
  address: string;
}

const LocationInfo = ({ address }: LocationInfoProps) => {
  return (
    <Body fontSize="b3" colorShade={500}>
      {address}
    </Body>
  );
};

interface RatingAndReviewCountInfoProps {
  rating: number;
  reviewCount: number;
}

const RatingAndReviewCountInfo = ({
  rating,
  reviewCount,
}: RatingAndReviewCountInfoProps) => {
  return (
    <HStack gap={8} align="center">
      <HStack gap={4} align="center">
        <FillStarIcon
          width={14}
          height={14}
          color={vars.colors.$scale.yellow[200]}
        />
        <Body fontSize="b3" colorShade={500}>
          {rating}
        </Body>
      </HStack>
      <Body fontSize="b3" colorShade={500}>
        •
      </Body>
      <Body fontSize="b3" colorShade={500}>
        방문자 리뷰 {reviewCount}개
      </Body>
    </HStack>
  );
};
