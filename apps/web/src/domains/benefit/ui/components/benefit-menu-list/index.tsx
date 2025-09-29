"use client";

import {
  ArrowRightIcon,
  ExitIcon,
  FolderIcon,
  PenIcon,
} from "@nugudi/assets-icons";
import { Body, VStack } from "@nugudi/react-components-layout";
import { NavigationItem } from "@nugudi/react-components-navigation-item";
import Link from "next/link";
import * as styles from "./index.css";

export const BenefitMenuList = () => {
  const menuItems = [
    {
      id: "mbti",
      title: "밥 MBTI 검사하기",
      description: "검사하고 매일 추천받기",
      icon: <PenIcon />,
      href: "/benefits/mbti",
    },
    {
      id: "register",
      title: "구디 맛있는 구내식당 등록",
      description: "20 포인트 받기",
      icon: <FolderIcon />,
      href: "/cafeterias/request-register",
    },
    {
      id: "request",
      title: "식당 삭제 요청",
      description: "식당 삭제에 관한 메시지",
      icon: <ExitIcon />,
      href: "/cafeterias/request-deletion",
    },
  ];

  return (
    <VStack gap={12}>
      {menuItems.map((item) => (
        <Link href={item.href} key={item.id} className={styles.linkWrapper}>
          <NavigationItem
            size="md"
            leftIcon={<span>{item.icon}</span>}
            rightIcon={<ArrowRightIcon />}
          >
            <VStack gap={4}>
              <Body fontSize="b3b" color="zinc" colorShade={500}>
                {item.title}
              </Body>
              <Body fontSize="b4" color="zinc" colorShade={400}>
                {item.description}
              </Body>
            </VStack>
          </NavigationItem>
        </Link>
      ))}
    </VStack>
  );
};
