import { ClockIcon, HeartIcon, ShareIcon } from "@nugudi/assets-icons";
import {
  Body,
  Box,
  Divider,
  Emphasis,
  HStack,
  Title,
  VStack,
} from "@nugudi/react-components-layout";
import type { CafeteriaDetail } from "../../../types/cafeteria-detail";
import * as styles from "./index.css";

interface CafeteriaInfoCardProps {
  cafeteria: CafeteriaDetail;
}

export const CafeteriaInfoCard = ({ cafeteria }: CafeteriaInfoCardProps) => {
  return (
    <Box className={styles.infoCard} marginTop={-64} mX={16}>
      <VStack align="center" gap={16} padding={24}>
        <VStack gap={8} align="center">
          {cafeteria.isPackagingAvailable && <PackagingAvailableNotice />}
          <CafeteriaNameWithActions name={cafeteria.name} />
        </VStack>
        <Divider />
        <OperatingHours hours={cafeteria.operatingHours} />
      </VStack>
    </Box>
  );
};

const PackagingAvailableNotice = () => {
  return (
    <Emphasis fontSize="e1" colorShade={600}>
      해당 매장은 <span className={styles.emphasisText}>포장</span>이 가능해요
    </Emphasis>
  );
};

const CafeteriaNameWithActions = ({ name }: { name: string }) => {
  return (
    <VStack align="center" gap={2}>
      <HStack align="center" gap={12}>
        <Title fontSize="t2" className={styles.nameText}>
          {name}
        </Title>
        <ActionButtons />
      </HStack>
      <LocationInfo />
    </VStack>
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

const LocationInfo = () => {
  return (
    <Body fontSize="b4" colorShade={500}>
      천안포스트 지하 1층
    </Body>
  );
};

const OperatingHours = ({ hours }: { hours: string }) => {
  return (
    <HStack gap={8} align="center">
      <ClockIcon width={16} height={16} />
      <Body fontSize="b4" colorShade={500}>
        {hours}
      </Body>
    </HStack>
  );
};
