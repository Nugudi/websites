import { HeartIcon, ShareIcon } from "@nugudi/assets-icons";
import {
  Body,
  Box,
  Divider,
  HStack,
  Title,
  VStack,
} from "@nugudi/react-components-layout";
import type { CafeteriaItem } from "../../../types";
import * as styles from "./index.css";

interface CafeteriaInfoCardProps {
  cafeteria: CafeteriaItem;
}

export const CafeteriaInfoCard = ({ cafeteria }: CafeteriaInfoCardProps) => {
  return (
    <Box className={styles.infoCard} marginTop={-64} mX={16}>
      <VStack align="center" gap={16} padding={24}>
        <VStack gap={8} align="center" width="100%">
          {cafeteria.takeoutAvailable && <PackagingAvailableNotice />}
          <CafeteriaNameWithActions name={cafeteria.name || ""} />
          <Divider />
          <LocationInfo address={cafeteria.address || ""} />
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
