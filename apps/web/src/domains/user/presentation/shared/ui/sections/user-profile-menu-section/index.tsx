import { Box, VStack } from "@nugudi/react-components-layout";
import type { Route } from "next";
import { UserProfileNavigationLink } from "../../components/user-profile-navigation-link";
import * as styles from "./index.css";

export const menuItems: Array<{ href: Route; label: string }> = [
  { href: "/profile/settings/notifications", label: "알림 설정" },
  { href: "/profile/settings/privacy", label: "개인정보 약관" },
];

export const UserProfileMenuSection = () => {
  return (
    <Box className={styles.container} boxShadow="sm" borderRadius="xl" p="2">
      <VStack gap={4}>
        {menuItems.map((item) => (
          <UserProfileNavigationLink key={item.label} href={item.href}>
            {item.label}
          </UserProfileNavigationLink>
        ))}
      </VStack>
    </Box>
  );
};
