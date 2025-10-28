"use client";

import { InfoIcon } from "@nugudi/assets-icons";
import {
  Body,
  Box,
  HStack,
  Title,
  VStack,
} from "@nugudi/react-components-layout";
import { formatPriceWithCurrency } from "@/src/domains/user/utils/format-points";
import { getMockCafeteriaData } from "../../../mocks/cafeteria-mock-data";
import type { CafeteriaDetail } from "../../../types/cafeteria-detail";
import * as styles from "./index.css";

interface CafeteriaInfoTabProps {
  cafeteriaId: string;
}

export const CafeteriaInfoTab = ({ cafeteriaId }: CafeteriaInfoTabProps) => {
  const cafeteria = getMockCafeteriaData(cafeteriaId);

  return (
    <VStack gap={32} pt={16} pb={24}>
      <BusinessInfo cafeteria={cafeteria} />
      <LocationInfo address={cafeteria.location} />
      <EtcInfo />
    </VStack>
  );
};

interface BusinessInfoProps {
  cafeteria: CafeteriaDetail;
}

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
        <InfoRow icon="🗓" label={`영업 중 · ${cafeteria.operatingHours}`} />
        <InfoRow
          icon="💰"
          label={`가격 ${formatPriceWithCurrency(cafeteria.price)}`}
        />
        {cafeteria.isPackagingAvailable && (
          <InfoRow icon="📦" label="포장 가능" />
        )}
      </VStack>
    </VStack>
  );
};

interface LocationInfoProps {
  address: string;
}

const LocationInfo = ({ address }: LocationInfoProps) => {
  return (
    <VStack gap={12}>
      <Title fontSize="t3" colorShade={800}>
        위치정보
      </Title>
      <VStack gap={12}>
        <Box height={180} borderRadius="lg" className={styles.mapPlaceholder}>
          <Body fontSize="b3" colorShade={500}>
            지도 들어갈 자리
          </Body>
        </Box>
        <VStack
          gap={4}
          padding={16}
          borderRadius="md"
          className={styles.infoSection}
        >
          <Body fontSize="b3" colorShade={700}>
            {address}
          </Body>
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
      <Body fontSize="b3" colorShade={700}>
        {label}
      </Body>
    </HStack>
  );
};
