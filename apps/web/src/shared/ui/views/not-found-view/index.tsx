"use client";

import { Button } from "@nugudi/react-components-button";
import { Body, Title, VStack } from "@nugudi/react-components-layout";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as styles from "./index.css";

interface NotFoundViewProps {
  errorCode?: string;
  title?: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  buttonText?: string;
  onButtonClick?: () => void;
  redirectPath?: string;
  showButton?: boolean;
}

/**
 * 404 에러 및 기타 Not Found 상태를 표시하는 뷰 컴포넌트
 *
 * @param {Object} props - 컴포넌트 props
 * @param {string} [props.errorCode="404"] - 에러 코드 (예: "404", "500")
 * @param {string} [props.title="페이지를 찾을 수 없어요"] - 메인 제목 텍스트
 * @param {string} [props.description="요청하신 페이지가 존재하지 않거나 이동되었습니다."] - 설명 텍스트
 * @param {Object} [props.image] - 이미지 설정 객체
 * @param {string} props.image.src - 이미지 경로
 * @param {string} props.image.alt - 이미지 대체 텍스트
 * @param {number} props.image.width - 이미지 너비
 * @param {number} props.image.height - 이미지 높이
 * @param {string} [props.buttonText="홈으로 돌아가기"] - 버튼 텍스트
 * @param {Function} [props.onButtonClick] - 버튼 클릭 시 실행할 커스텀 핸들러
 * @param {string} [props.redirectPath="/"] - 리다이렉트 경로 (onButtonClick이 없을 때 사용)
 * @param {boolean} [props.showButton=true] - 버튼 표시 여부
 * @returns {JSX.Element} NotFoundView 컴포넌트
 */
export const NotFoundView = ({
  errorCode = "404",
  title = "페이지를 찾을 수 없어요",
  description = "요청하신 페이지가 존재하지 않거나 이동되었습니다.",
  image = {
    src: "/images/404-nugudi.webp",
    alt: "404 너구리",
    width: 178,
    height: 218,
  },
  buttonText = "홈으로 돌아가기",
  onButtonClick,
  redirectPath = "/",
  showButton = true,
}: NotFoundViewProps) => {
  const router = useRouter();

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      router.push(redirectPath);
    }
  };

  return (
    <VStack
      justify="center"
      align="center"
      gap={32}
      className={styles.container}
    >
      <VStack gap={12}>
        <Body fontSize="b3b" color="whiteAlpha" colorShade={900}>
          ERROR {errorCode}
        </Body>

        <Title fontSize="t1" as="h1" color="whiteAlpha" colorShade={900}>
          {title}
        </Title>

        <Body fontSize="b1" color="whiteAlpha" colorShade={800}>
          {description}
        </Body>
      </VStack>

      <div className={styles.imageWrapper}>
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          priority
        />
      </div>

      {showButton && (
        <Button
          variant="brand"
          color="zinc"
          onClick={handleButtonClick}
          size="md"
          className={styles.button}
        >
          {buttonText}
        </Button>
      )}
    </VStack>
  );
};
