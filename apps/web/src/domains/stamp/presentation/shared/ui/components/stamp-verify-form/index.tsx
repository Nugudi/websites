"use client";

import { Button } from "@nugudi/react-components-button";
import { Box, VStack } from "@nugudi/react-components-layout";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useConsumeStamp } from "@/src/domains/stamp/presentation/client/hooks/mutations/consume-stamp.mutation";
import { useGetStampCollection } from "@/src/domains/stamp/presentation/client/hooks/queries/get-stamp-collection.query";
import { FoodInfoCard } from "./food-info-card";
import { ImageUploadArea } from "./image-upload-area";
import * as styles from "./index.css";

export const StampVerifyForm = () => {
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: stampCollection } = useGetStampCollection();
  const { mutate: consumeStamp, isPending } = useConsumeStamp();

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setUploadedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = () => {
    if (!uploadedImage) {
      return;
    }

    const unusedStamp = stampCollection?.stamps.find((stamp) => !stamp.isUsed);
    if (!unusedStamp) {
      alert("사용 가능한 스탬프가 없습니다.");
      return;
    }

    consumeStamp(unusedStamp.id, {
      onSuccess: () => {
        alert("스탬프 인증이 완료되었습니다!");
        router.push("/cafeterias/stamps");
      },
      onError: (error) => {
        alert(`스탬프 인증에 실패했습니다: ${error.message}`);
      },
    });
  };

  return (
    <VStack className={styles.container}>
      <VStack gap={36} mt={24}>
        <FoodInfoCard date="2025년 7월 7일" amount="7,000 원" />

        <ImageUploadArea
          imagePreview={imagePreview}
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
        />
      </VStack>

      <Box width="full" paddingTop={20}>
        <Button
          variant="brand"
          color="zinc"
          size="lg"
          width="full"
          onClick={handleSubmit}
          disabled={!uploadedImage || isPending}
        >
          {isPending ? "인증 중..." : "인증하기"}
        </Button>
      </Box>
    </VStack>
  );
};
