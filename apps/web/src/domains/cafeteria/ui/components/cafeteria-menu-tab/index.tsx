"use client";

import { Button } from "@nugudi/react-components-button";
import { Chip } from "@nugudi/react-components-chip";
import {
  Body,
  Box,
  HStack,
  Title,
  VStack,
} from "@nugudi/react-components-layout";
import { MenuCard } from "@nugudi/react-components-menu-card";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMockMenuData } from "../../../mocks/cafeteria-mock-data";
import * as styles from "./index.css";

// TODO: Phase 4 - Replace with proper OpenAPI types
type CafeteriaDetail = {
  name: string;
};

interface CafeteriaMenuTabProps {
  cafeteria: CafeteriaDetail;
  cafeteriaId: string;
}

export const CafeteriaMenuTab = ({
  cafeteria,
  cafeteriaId,
}: CafeteriaMenuTabProps) => {
  const menuData = getMockMenuData();

  return (
    <VStack gap={24} pt={16} pb={24}>
      <ReviewPromptCard
        cafeteriaId={cafeteriaId}
        cafeteriaName={cafeteria.name}
      />

      {menuData.map((menu) => (
        <VStack key={menu.date} gap={8}>
          <DateHeader
            date={menu.date}
            reviewId={menu.id}
            cafeteriaId={cafeteriaId}
          />
          <MenuCard
            title="🌞 점심"
            subtitle={`일반 성인 기준 점심 칼로리는 256 kcal 이에요 !`}
            items={menu.items}
          />
        </VStack>
      ))}
    </VStack>
  );
};

interface ReviewPromptCardProps {
  cafeteriaId: string;
  cafeteriaName: string;
}

const ReviewPromptCard = ({
  cafeteriaId,
  cafeteriaName,
}: ReviewPromptCardProps) => {
  return (
    <VStack gap={32} pY={16} className={styles.reviewPromptCard}>
      <ReviewPromptText cafeteriaName={cafeteriaName} />
      <Box className={styles.buttonBox}>
        <CharacterImage />
        <WriteReviewButton cafeteriaId={cafeteriaId} />
      </Box>
    </VStack>
  );
};

interface ReviewPromptTextProps {
  cafeteriaName: string;
}

const ReviewPromptText = ({ cafeteriaName }: ReviewPromptTextProps) => {
  return (
    <VStack align="start" grow={1}>
      <Title fontSize="t2">{cafeteriaName}에 다녀오셨나요?</Title>
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

interface DateHeaderProps {
  date: string;
  reviewId: string;
  cafeteriaId: string;
}

const DateHeader = ({ date, reviewId, cafeteriaId }: DateHeaderProps) => {
  return (
    <HStack justify="space-between" align="center" width="100%" pX={4}>
      <Body fontSize="b3b" colorShade={600}>
        {date}
      </Body>
      <Link href={`/cafeterias/${cafeteriaId}/menus/${date}/reviews`}>
        <Chip size="sm" label="리뷰 보기" />
      </Link>
    </HStack>
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
