"use client";

import { CameraLineIcon, XIcon } from "@nugudi/assets-icons";
import { Box, Flex } from "@nugudi/react-components-layout";
import { vars } from "@nugudi/themes";
import Image from "next/image";
import { useRef } from "react";
import * as styles from "./index.css";

interface ImageUploadAreaProps {
  imagePreview: string | null;
  onImageUpload: (file: File) => void;
  onImageRemove: () => void;
}

export const ImageUploadArea = ({
  imagePreview,
  onImageUpload,
  onImageRemove,
}: ImageUploadAreaProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 이미지 파일만 허용
      if (file.type.startsWith("image/")) {
        onImageUpload(file);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box className={styles.uploadContainer}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className={styles.hiddenInput}
      />

      {imagePreview ? (
        <Box className={styles.previewContainer}>
          <Image
            src={imagePreview}
            alt="업로드된 영수증"
            fill
            className={styles.previewImage}
            style={{ objectFit: "cover" }}
          />
          <button
            className={styles.removeButton}
            onClick={onImageRemove}
            aria-label="이미지 삭제"
            type="button"
          >
            <XIcon
              width={28}
              height={28}
              color={vars.colors.$static.light.color.white}
            />
          </button>
        </Box>
      ) : (
        <Flex
          className={styles.uploadButton}
          onClick={handleUploadClick}
          justify="center"
          align="center"
          direction="column"
        >
          <CameraLineIcon
            color={vars.colors.$scale.zinc[400]}
            width={48}
            height={48}
          />
        </Flex>
      )}
    </Box>
  );
};
