"use client";

import { Button } from "@nugudi/react-components-button";
import { Box, VStack } from "@nugudi/react-components-layout";
import { useState } from "react";
import { FoodInfoCard } from "./food-info-card";
import { ImageUploadArea } from "./image-upload-area";
import * as styles from "./index.css";

export const StampVerifyForm = () => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
    // TODO: API 호출하여 이미지 업로드 및 인증 처리
    console.log("Submit:", uploadedImage);
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
          disabled={!uploadedImage}
        >
          인증하기
        </Button>
      </Box>
    </VStack>
  );
};
