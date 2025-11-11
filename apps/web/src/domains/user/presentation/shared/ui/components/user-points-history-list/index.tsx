import { Body, Flex, VStack } from "@nugudi/react-components-layout";
import { UserPointsHistoryItem } from "../user-points-history-item";

export interface PointTransaction {
  id: number;
  type: "meal" | "event";
  title: string;
  amount: number;
}

export interface DailyPointData {
  date: string;
  transactions: PointTransaction[];
}

interface UserPointsHistoryListProps {
  pointsData: DailyPointData[];
}

export const UserPointsHistoryList = ({
  pointsData,
}: UserPointsHistoryListProps) => {
  if (pointsData.length === 0) {
    return <EmptyHistoryMessage />;
  }

  return (
    <Flex grow={1} direction="column" pX={16} pb={16} gap={16}>
      {pointsData.map((dailyData) => (
        <DailyPointsGroup key={dailyData.date} data={dailyData} />
      ))}
    </Flex>
  );
};

const DailyPointsGroup = ({ data }: { data: DailyPointData }) => {
  return (
    <VStack gap={8}>
      <DateLabel date={data.date} />
      <PointTransactionsList transactions={data.transactions} />
    </VStack>
  );
};

const DateLabel = ({ date }: { date: string }) => {
  return (
    <Body fontSize="b4" colorShade={400}>
      {date}
    </Body>
  );
};

const PointTransactionsList = ({
  transactions,
}: {
  transactions: PointTransaction[];
}) => {
  return (
    <VStack gap={8}>
      {transactions.map((transaction) => (
        <UserPointsHistoryItem
          key={transaction.id}
          type={transaction.type}
          title={transaction.title}
          amount={transaction.amount}
        />
      ))}
    </VStack>
  );
};

const EmptyHistoryMessage = () => {
  return (
    <Flex justify="center" align="center" pY={40}>
      <Body fontSize="b3" colorShade={400}>
        포인트 내역이 없습니다
      </Body>
    </Flex>
  );
};
