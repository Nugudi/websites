import { Body, Title, VStack } from "@nugudi/react-components-layout";

export const StampVerifyHeader = () => {
  return (
    <VStack gap={4}>
      <Title fontSize="t2" color="zinc" colorShade={800}>
        구내식당 투어 인증 영수증 업로드
      </Title>
      <Body fontSize="b3" color="zinc" colorShade={500}>
        결제 내역 또는 영수증으로 인증할 수 있습니다.
      </Body>
      <Body fontSize="b3" color="zinc" colorShade={500}>
        단, 당일 이용한 내역만 인정됩니다.
      </Body>
    </VStack>
  );
};
