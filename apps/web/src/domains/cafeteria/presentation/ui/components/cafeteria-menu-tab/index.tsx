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
import type {
  Cafeteria,
  CafeteriaMenuTimeline,
} from "../../../../domain/entities";
import { useGetCafeteriaMenuTimeline } from "../../../hooks";
import { getMealTypeTitle } from "../../../utils";
import * as styles from "./index.css";

type CafeteriaMenuTabProps = {
  cafeteria: Cafeteria;
  cafeteriaId: string;
};

export const CafeteriaMenuTab = ({
  cafeteria,
  cafeteriaId,
}: CafeteriaMenuTabProps) => {
  const { data } = useGetCafeteriaMenuTimeline(cafeteriaId);
  const menuData = data.data;

  return (
    <VStack gap={0} pt={16} pb={24}>
      <ReviewPromptCard
        cafeteriaId={cafeteriaId}
        cafeteriaName={cafeteria.name || ""}
      />

      <div className={styles.timelineContainer}>
        {menuData.map((menu) => (
          <MenuItem key={menu.menuDate} menu={menu} cafeteriaId={cafeteriaId} />
        ))}
      </div>
    </VStack>
  );
};

type MenuItemProps = {
  menu: CafeteriaMenuTimeline;
  cafeteriaId: string;
};

const MenuItem = ({ menu, cafeteriaId }: MenuItemProps) => {
  return (
    <HStack
      key={menu.menuDate}
      className={styles.timelineItem}
      gap={4}
      pb={24}
      align="start"
    >
      <div className={styles.timelineLine} />
      <div className={styles.circle} />
      <VStack gap={8} grow={1}>
        <DateHeader date={menu.menuDate} cafeteriaId={cafeteriaId} />
        {menu.menus.map((menuInfo, index) => {
          const title = getMealTypeTitle(menuInfo.mealType) || "메뉴";

          return (
            <MenuCard
              variant="subtle"
              key={`${menu.menuDate}-${index}`}
              title={title}
              items={menuInfo.menuItems}
            />
          );
        })}
      </VStack>
    </HStack>
  );
};

type ReviewPromptCardProps = {
  cafeteriaId: string;
  cafeteriaName: NonNullable<Cafeteria["name"]>;
};

const ReviewPromptCard = ({
  cafeteriaId,
  cafeteriaName,
}: ReviewPromptCardProps) => {
  return (
    <VStack gap={32} pY={16} mb={32} className={styles.reviewPromptCard}>
      <ReviewPromptText cafeteriaName={cafeteriaName} />
      <Box className={styles.buttonBox}>
        <CharacterImage />
        <WriteReviewButton cafeteriaId={cafeteriaId} />
      </Box>
    </VStack>
  );
};

type ReviewPromptTextProps = Pick<ReviewPromptCardProps, "cafeteriaName">;

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

type DateHeaderProps = {
  date: CafeteriaMenuTimeline["menuDate"];
  cafeteriaId: string;
};

const DateHeader = ({ date, cafeteriaId }: DateHeaderProps) => {
  return (
    <HStack justify="space-between" align="center" width="100%" pX={4}>
      <Body fontSize="b2" colorShade={500}>
        {date}
      </Body>
      <Link href={`/cafeterias/${cafeteriaId}/menus/${date}/reviews`}>
        <Chip size="sm" label="리뷰 보기" />
      </Link>
    </HStack>
  );
};

type WriteReviewButtonProps = Pick<CafeteriaMenuTabProps, "cafeteriaId">;

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
