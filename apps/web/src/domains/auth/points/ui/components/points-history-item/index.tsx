import { Body, Box, HStack } from "@nugudi/react-components-layout";
import Image from "next/image";
import { formatPointAmount } from "../../../utils";
import * as styles from "./index.css";

interface AuthPointsHistoryItemProps {
  type: "meal" | "event";
  title: string;
  amount: number;
}

export const AuthPointsHistoryItem = ({
  type,
  title,
  amount,
}: AuthPointsHistoryItemProps) => {
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

const TransactionIcon = ({ type }: { type: "meal" | "event" }) => {
  // TODO: 포인트 타입에 따라 추후 변경 예정
  const getIconSrc = (type: "meal" | "event") => {
    switch (type) {
      case "meal":
        return "/images/ic-cooking.png";
      case "event":
        return "/images/ic-clapping-hands.png";
      default:
        return "/images/ic-clapping-hands.png";
    }
  };

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
