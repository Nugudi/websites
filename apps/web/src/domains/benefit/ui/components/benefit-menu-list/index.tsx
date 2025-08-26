"use client";

import { ArrowRightIcon } from "@nugudi/assets-icons";
import { VStack } from "@nugudi/react-components-layout";
import { NavigationItem } from "@nugudi/react-components-navigation-item";

export const BenefitMenuList = () => {
  const menuItems = [
    {
      id: "mbit",
      title: "밥 MBIT 검사하기",
      description: "검사하고 매일 추천받기",
      icon: "🎨", // 임시 아이콘
    },
    {
      id: "register",
      title: "구디 맛있는 구내식당 등록",
      description: "20포인트 받기",
      icon: "📁", // 임시 아이콘
    },
    {
      id: "request",
      title: "식당 사제 요청",
      description: "식당 사제에 관한 메시지",
      icon: "✅", // 임시 아이콘
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
