import type { CafeteriaDetailItem } from "@cafeteria/presentation/shared/types";
import { formatPriceWithCurrency } from "@core/utils/currency";
import { InfoIcon } from "@nugudi/assets-icons";
import {
  Body,
  Box,
  HStack,
  Title,
  VStack,
} from "@nugudi/react-components-layout";
import * as styles from "./index.css";

type CafeteriaInfoTabProps = {
  cafeteria: CafeteriaDetailItem;
};

export const CafeteriaInfoTab = ({ cafeteria }: CafeteriaInfoTabProps) => {
  return (
    <VStack gap={32} pt={16} pb={24}>
      <BusinessInfo cafeteria={cafeteria} />
      <LocationInfo cafeteria={cafeteria} />
      <EtcInfo />
    </VStack>
  );
};

type BusinessInfoProps = {
  cafeteria: CafeteriaDetailItem;
};

const BusinessInfo = ({ cafeteria }: BusinessInfoProps) => {
  return (
    <VStack gap={12}>
      <Title fontSize="t3" colorShade={800}>
        영업정보
      </Title>
      <VStack
        gap={8}
        padding={16}
        borderRadius="md"
        className={styles.infoSection}
      >
        <InfoRow icon="⏰" label={cafeteria.fullBusinessHours} />
        {cafeteria.hasNote && (
          <InfoRow icon="📝" label={cafeteria.businessHours!.note!} />
        )}
        {cafeteria.hasMealTicketPrice && (
          <InfoRow
            icon="💰"
            label={`가격 ${formatPriceWithCurrency(cafeteria.mealTicketPrice!)}`}
          />
        )}
        {cafeteria.canTakeout && <InfoRow icon="📦" label="포장 가능" />}
        {cafeteria.hasPhone && <InfoRow icon="📞" label={cafeteria.phone!} />}
      </VStack>
    </VStack>
  );
};

type LocationInfoProps = {
  cafeteria: CafeteriaDetailItem;
};

const LocationInfo = ({ cafeteria }: LocationInfoProps) => {
  const hasCoordinates = cafeteria.hasLocation;

  return (
    <VStack gap={12}>
      <Title fontSize="t3" colorShade={800}>
        위치정보
      </Title>
      <VStack gap={12}>
        <Box height={180} borderRadius="lg" className={styles.mapPlaceholder}>
          <Body fontSize="b3" colorShade={500}>
            {hasCoordinates
              ? `지도 (${cafeteria.latitude}, ${cafeteria.longitude})`
              : "위치 정보 없음"}
          </Body>
        </Box>
        <VStack
          gap={8}
          padding={16}
          borderRadius="md"
          className={styles.infoSection}
        >
          <InfoRow icon="📍" label={cafeteria.address || "주소 정보 없음"} />
        </VStack>
      </VStack>
    </VStack>
  );
};

const EtcInfo = () => {
  return (
    <VStack gap={12}>
      <Title fontSize="t3" colorShade={800}>
        기타정보
      </Title>
      <VStack
        gap={8}
        padding={16}
        borderRadius="md"
        className={styles.infoSection}
      >
        <InfoRow
          icon={<InfoIcon width={16} height={16} />}
          label="상기 식단은 식자재 수급 상황에 따라 변경될 수 있어요"
        />
      </VStack>
    </VStack>
  );
};

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
}

const InfoRow = ({ icon, label }: InfoRowProps) => {
  return (
    <HStack gap={8} align="center">
      <Box className={styles.infoIcon}>{icon}</Box>
      <Body fontSize="b3" colorShade={700} className={styles.infoLabel}>
        {label}
      </Body>
    </HStack>
  );
};
