"use client";

import {
  type CafeteriaInfoFormData,
  cafeteriaInfoSchema,
} from "@cafeteria/presentation/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CameraLineIcon } from "@nugudi/assets-icons";
import { Button } from "@nugudi/react-components-button";
import { Input } from "@nugudi/react-components-input";
import { Body, Box, Title, VStack } from "@nugudi/react-components-layout";
import { useForm } from "react-hook-form";
import * as styles from "./index.css";

interface CafeteriaInfoFormProps {
  onNext: () => void;
}

export const CafeteriaInfoForm = ({ onNext }: CafeteriaInfoFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CafeteriaInfoFormData>({
    resolver: zodResolver(cafeteriaInfoSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      address: "",
      detailAddress: "",
      openingHours: "",
      review: "",
    },
  });

  const onSubmit = (_data: CafeteriaInfoFormData) => {
    // TODO: API 호출로 데이터 전송
    onNext();
  };

  const handleAddressSearch = () => {
    // TODO: 주소 검색 연동
  };

  const handleImageUpload = () => {
    // TODO: 이미지 업로드 기능 구현
  };

  return (
    <VStack
      h="full"
      justify="space-between"
      gap={32}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      className={styles.container}
    >
      <VStack gap={8}>
        <FormInfoText />
        <VStack gap={16} mt={24}>
          <Input
            {...register("name")}
            label="식당명*"
            id="name"
            placeholder="너구디식당"
            variant="filled"
            isError={!!errors.name}
            errorMessage={errors.name?.message}
          />
          <Box h={64} p={10} borderRadius="xl" className={styles.mapContainer}>
            <Body fontSize="b3" colorShade={400}>
              지도를 연결할 부분
            </Body>
          </Box>
          <Input
            {...register("address")}
            label="주소/건물명*"
            id="address"
            placeholder="너굴공원 1단지 지하 1층"
            onClick={handleAddressSearch}
            variant="filled"
            isError={!!errors.address}
            errorMessage={errors.address?.message}
          />
          <Input
            {...register("openingHours")}
            id="openingHours"
            label="영업 시간"
            placeholder="(선택) 오전 9시 ~ 오후 2시"
            variant="filled"
            isError={!!errors.openingHours}
            errorMessage={errors.openingHours?.message}
          />
          <Input
            {...register("review")}
            id="review"
            label="리뷰*"
            placeholder="너구디 식당은 4000원이다 너굴"
            variant="filled"
            isError={!!errors.review}
            errorMessage={errors.review?.message}
          />
          <VStack
            gap={8}
            align="center"
            justify="center"
            p={64}
            borderRadius="xl"
            className={styles.imageUploadBox}
            onClick={handleImageUpload}
          >
            <CameraLineIcon width={24} height={24} />
            <Body fontSize="b3" as="p" colorShade={400}>
              식당 대표 이미지
            </Body>
          </VStack>
        </VStack>
      </VStack>

      <VStack gap={16}>
        <Button
          variant="brand"
          color="main"
          size="lg"
          disabled={!isValid || isSubmitting}
          type="submit"
        >
          식당 제안하기
        </Button>
      </VStack>
    </VStack>
  );
};

const FormInfoText = () => {
  return (
    <Title fontSize="t2" className={styles.title} as="h2">
      <Box as="span" color="main">
        구디
      </Box>
      식당 여기있어요 !
    </Title>
  );
};
