import {
  Body,
  Box,
  Emphasis,
  HStack,
  Title,
  VStack,
} from "@nugudi/react-components-layout";
import * as styles from "./index.css";

interface FoodInfoCardProps {
  date: string;
  amount: string;
}

export const FoodInfoCard = ({ date, amount }: FoodInfoCardProps) => {
  return (
    <Box className={styles.card} p={20}>
      <HStack justify="space-between" align="center">
        <VStack gap={12}>
          <Body fontSize="b3" color="blackAlpha">
            너구디 푸드
          </Body>
          <Body fontSize="b4" color="zinc" colorShade={500}>
            {date}
          </Body>
        </VStack>
        <Title fontSize="t3" color="blackAlpha">
          {amount}
        </Title>
      </HStack>
      <Emphasis
        fontSize="e1"
        color="zinc"
        colorShade={400}
        className={styles.disclaimer}
      >
        *예시 이미지
      </Emphasis>
    </Box>
  );
};
