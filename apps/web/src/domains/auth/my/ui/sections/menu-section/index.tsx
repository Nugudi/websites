import { Box, VStack } from "@nugudi/react-components-layout";
import NavigationLink from "../../components/navigation-link";
import * as styles from "./index.css";

//TODO: 이동 경로 추가 후 수정
const menuItems = [
  { href: "/", label: "알림 설정" },
  { href: "/", label: "개인정보 약관" },
];

const MenuSection = () => {
  return (
    <Box
      className={styles.container}
      boxShadow="sm"
      borderRadius="xl"
      padding={2}
    >
      <VStack gap={4}>
        {menuItems.map((item) => (
          <NavigationLink key={item.label} href={item.href}>
            {item.label}
          </NavigationLink>
        ))}
      </VStack>
    </Box>
  );
};

export default MenuSection;
