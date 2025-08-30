import { Box, VStack } from "@nugudi/react-components-layout";
import NavigationLink from "../../components/navigation-link";
import * as styles from "./index.css";

const menuItems = [
  { href: "/profile/settings/notifications", label: "알림 설정" },
  { href: "/profile/settings/privacy", label: "개인정보 약관" },
];

const MenuSection = () => {
  return (
    <Box className={styles.container} boxShadow="sm" borderRadius="xl" p="2">
      <VStack gap="4">
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
