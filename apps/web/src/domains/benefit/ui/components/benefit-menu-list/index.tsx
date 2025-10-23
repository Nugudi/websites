"use client";

import { BusIcon, ExitIcon, FolderIcon } from "@nugudi/assets-icons";
import { Body, Box, VStack } from "@nugudi/react-components-layout";
import { NavigationItem } from "@nugudi/react-components-navigation-item";
import type { Route } from "next";
import Link from "next/link";
import * as styles from "./index.css";

interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: Route;
}

export const BenefitMenuList = () => {
  const menuItems: MenuItem[] = [
    // {
    //   id: "mbti",
    //   title: "밥 MBTI 검사하기",
    //   description: "검사하고 매일 추천받기",
    //   icon: <PenIcon />,
    //   href: "/benefits/mbti",
    // },
    // {
    //   id: "menu",
    //   title: "오늘의 식단 업로드",
    //   description: "제일 먼저 올리고 10포인트 받기",
    //   icon: <PenIcon width={16} height={16} />,
    //   href: "/cafeterias/menu",
    // },
    {
      id: "stamp",
      title: "구디 구내식당 투어",
      description: "인증하고 10포인트 받기",
      icon: <BusIcon width={16} height={16} />,
      href: "/cafeterias/stamps",
    },
    {
      id: "register",
      title: "구디 맛있는 구내식당 등록",
      description: "구내식당 소개하고 20 포인트 받기",
      icon: <FolderIcon width={16} height={16} />,
      href: "/cafeterias/request-register",
    },
    {
      id: "request",
      title: "식당 삭제 요청",
      description: "사라진 식당 찾고 10포인트 받기",
      icon: <ExitIcon width={16} height={16} />,
      href: "/cafeterias/request-deletion",
    },
  ];

  return (
    <VStack gap={12} grow={1} h="full">
      {menuItems.map((item) => (
        <MenuItem item={item} key={item.id} />
      ))}
    </VStack>
  );
};

const MenuItem = ({ item }: { item: MenuItem }) => {
  return (
    <Link href={item.href} className={styles.linkWrapper}>
      <NavigationItem
        size="md"
        leftIcon={
          <Box as="span" className={styles.leftIcon}>
            {item.icon}
          </Box>
        }
      >
        <VStack gap={4}>
          <Body fontSize="b3b" colorShade={600}>
            {item.title}
          </Body>
          <Body fontSize="b4" colorShade={400}>
            {item.description}
          </Body>
        </VStack>
      </NavigationItem>
    </Link>
  );
};
