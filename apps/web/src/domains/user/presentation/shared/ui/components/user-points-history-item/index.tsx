import { Body, Box, HStack } from "@nugudi/react-components-layout";
import { formatPointAmount } from "@user/presentation/shared/utils";
import Image from "next/image";
import * as styles from "./index.css";

interface UserPointsHistoryItemProps {
  type: "meal" | "event";
  title: string;
  amount: number;
}

export const UserPointsHistoryItem = ({
  type,
  title,
  amount,
}: UserPointsHistoryItemProps) => {
  return (
    <HStack justify="space-between" align="center" gap={20}>
      <TransactionInfo type={type} title={title} />
      <PointAmount amount={amount} />
    </HStack>
  );
};

const TransactionInfo = ({
  type,
  title,
}: {
  type: "meal" | "event";
  title: string;
}) => {
  return (
    <HStack gap={8} align="center">
      <TransactionIcon type={type} />
      <Body fontSize="b3b" className={styles.title}>
        {title}
      </Body>
    </HStack>
  );
};

// TODO: 포인트 타입에 따라 추후 변경/분리 예정
const getIconSrc = (type: "meal" | "event") => {
  switch (type) {
    case "meal":
      return "/images/ic-cooking.png";
    case "event":
      return "/images/ic-clapping-hands.png";
  }
};

const TransactionIcon = ({ type }: { type: "meal" | "event" }) => {
  return (
    <Box borderRadius="2xl" p={8} className={styles.iconWrapper}>
      <Image src={getIconSrc(type)} alt="" width={24} height={24} />
    </Box>
  );
};

const PointAmount = ({ amount }: { amount: number }) => {
  return (
    <Body fontSize="b3" colorShade={500}>
      {formatPointAmount(amount)}
    </Body>
  );
};
