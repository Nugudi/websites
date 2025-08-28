"use client";

import {
  ArrowRightIcon,
  ExitIcon,
  FolderIcon,
  PenIcon,
} from "@nugudi/assets-icons";
import { VStack } from "@nugudi/react-components-layout";
import { NavigationItem } from "@nugudi/react-components-navigation-item";

export const BenefitMenuList = () => {
  const menuItems = [
    {
      id: "mbti",
      title: "밥 MBTI 검사하기",
      description: "검사하고 매일 추천받기",
      icon: <PenIcon />,
    },
    {
      id: "register",
      title: "구디 맛있는 구내식당 등록",
      description: "20 포인트 받기",
      icon: <FolderIcon />,
    },
    {
      id: "request",
      title: "식당 삭제 요청",
      description: "식당 삭제에 관한 메시지",
      icon: <ExitIcon />,
    },
  ];

  return (
    <VStack gap="0">
      {menuItems.map((item) => (
        <NavigationItem
          key={item.id}
          leftIcon={<span>{item.icon}</span>}
          rightIcon={<ArrowRightIcon />}
          onClick={() => console.log(`Clicked ${item.id}`)}
        >
          <div>
            <div style={{ fontWeight: 500 }}>{item.title}</div>
            <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
              {item.description}
            </div>
          </div>
        </NavigationItem>
      ))}
    </VStack>
  );
};
