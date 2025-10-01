import { InfoIcon } from "@nugudi/assets-icons";
import {
  Body,
  Box,
  HStack,
  Title,
  VStack,
} from "@nugudi/react-components-layout";
import { vars } from "@nugudi/themes";
import Image from "next/image";
import { formatPointBalance } from "../../../utils";
import * as styles from "./index.css";

interface AuthPointsBalanceProps {
  balance: number;
}

export const AuthPointsBalance = ({ balance }: AuthPointsBalanceProps) => {
  return (
    <VStack gap={8} width="full" className={styles.container}>
      <MyPointInfo balance={balance} />
      <NuguriImage />
    </VStack>
  );
};

const MyPointInfo = ({ balance }: { balance: number }) => {
  return (
    <VStack align="flex-start" width="full">
      <Body fontSize="b3" colorShade={400}>
        총 포인트
      </Body>
      <HStack gap={8} align="center">
        <Title fontSize="t1" colorShade={700}>
          {formatPointBalance(balance)}
        </Title>
        <InfoIcon color={vars.colors.$scale.zinc[600]} />
      </HStack>
    </VStack>
  );
};

const NuguriImage = () => {
  return (
    <Box className={styles.imageWrapper}>
      <Image
        src="/images/point-nuguri.png"
        alt=""
        aria-hidden
        width={200}
        height={170}
        priority
      />
    </Box>
  );
};
