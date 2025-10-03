"use client";

import { Button } from "@nugudi/react-components-button";
import { Body, Box, Title, VStack } from "@nugudi/react-components-layout";
import type { Badge } from "@nugudi/react-components-review-card";
import { ReviewCard } from "@nugudi/react-components-review-card";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { getMockReviews } from "../../../constants/mock-data";
import * as styles from "./index.css";

interface Review {
  id: string;
  imageUrl?: string;
  imageAlt?: string;
  date: string;
  reviewText: string;
  badges: Badge[];
}

export const CafeteriaReviewTab = () => {
  const reviews = getMockReviews();
  const params = useParams();
  const cafeteriaId = params?.cafeteriaId as string;

  return (
    <VStack gap={16}>
      <ReviewPromptCard cafeteriaId={cafeteriaId} />
      <ReviewsList reviews={reviews} />
    </VStack>
  );
};

const ReviewPromptCard = ({ cafeteriaId }: { cafeteriaId: string }) => {
  return (
    <VStack gap={32} pY={16} className={styles.reviewPromptCard}>
      <ReviewPromptText />
      <Box className={styles.buttonBox}>
        <CharacterImage />
        <WriteReviewButton cafeteriaId={cafeteriaId} />
      </Box>
    </VStack>
  );
};

const ReviewPromptText = () => {
  return (
    <VStack align="start" grow={1}>
      <Title fontSize="t2">더애옹푸드에 다녀오셨나요?</Title>
      <Body fontSize="b3" color="zinc" colorShade={500}>
        오늘의 메뉴 리뷰를 남겨주세요!
      </Body>
    </VStack>
  );
};

const CharacterImage = () => {
  return (
    <Box width={80} height={80} className={styles.characterImageBox}>
      <Image
        src="/images/spoon_nuguri.png"
        alt=""
        aria-hidden
        width={70}
        height={80}
      />
    </Box>
  );
};

interface WriteReviewButtonProps {
  cafeteriaId: string;
}

const WriteReviewButton = ({ cafeteriaId }: WriteReviewButtonProps) => {
  const router = useRouter();

  return (
    <Button
      color="main"
      variant="brand"
      size="sm"
      width="full"
      className={styles.writeReviewButton}
      onClick={() => {
        router.push(`/cafeterias/${cafeteriaId}/reviews/write`);
      }}
    >
      리뷰 쓰기
    </Button>
  );
};

const ReviewsList = ({ reviews }: { reviews: Review[] }) => {
  return (
    <>
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          imageUrl={review.imageUrl}
          imageAlt={review.imageAlt}
          date={review.date}
          reviewText={review.reviewText}
          badges={review.badges}
        />
      ))}
    </>
  );
};
