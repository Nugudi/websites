import { Body, Title, VStack } from "@nugudi/react-components-layout";

export const StampWelcomeText = () => {
  return (
    <VStack justify="center" align="center" gap={8}>
      <Title fontSize="t2" color="zinc" colorShade={800}>
        구내식당 투어 인증
      </Title>

      <VStack gap={4} justify="center" align="center">
        <Body fontSize="b4" color="zinc" colorShade={600}>
          구디역 근처 여러 구내식당을 방문해보세요
        </Body>
        <Body fontSize="b4" color="zinc" colorShade={600}>
          각 식당 인증 완료시 20 포인트!
        </Body>
      </VStack>
    </VStack>
  );
};
