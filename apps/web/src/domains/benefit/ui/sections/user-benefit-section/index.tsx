import { BusIcon, CameraIcon } from "@nugudi/assets-icons";
import { Body, Emphasis, Grid } from "@nugudi/react-components-layout";
import { BenefitCard } from "../../components/benefit-card";

export const UserBenefitSection = () => {
  return (
    <Grid gap={48} templateColumns="repeat(2, 1fr)" templateRows="auto">
      <BenefitCard
        title={
          <Body fontSize="b3" color="main" colorShade={800}>
            오늘의 식단 <br /> 사진 업로드
          </Body>
        }
        description={
          <Emphasis fontSize="e2" color="zinc" colorShade={400}>
            제일 빠르게 올리고 <br /> 10 포인트 받기
          </Emphasis>
        }
        icon={<CameraIcon width={70} height={70} />}
      />
      <BenefitCard
        title={
          <Body fontSize="b3" color="main" colorShade={800}>
            구디 <br /> 구내식당 투어
          </Body>
        }
        description={
          <Emphasis fontSize="e2" color="zinc" colorShade={400}>
            제일 빠르게 올리고 <br /> 10 포인트 받기
          </Emphasis>
        }
        icon={<BusIcon width={70} height={70} />}
      />
    </Grid>
  );
};
