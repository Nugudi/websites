import { Body, Title, VStack } from "@nugudi/react-components-layout";

interface CafeteriaReviewInfoSectionProps {
  cafeteriaName: string;
}

export const CafeteriaReviewInfoSection = ({
  cafeteriaName,
}: CafeteriaReviewInfoSectionProps) => {
  return (
    <VStack gap={1} mt={8}>
      <Title fontSize="t2" color="main" colorShade={700}>
        {cafeteriaName}
      </Title>
      <Body fontSize="b3">7월 7일 메뉴에 대해 리뷰를 남겨주세요 !</Body>
    </VStack>
  );
};
