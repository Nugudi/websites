import { Box, VStack } from "@nugudi/react-components-layout";
import { ProfileNavigationLink } from "../../components/profile-navigation-link";
import * as styles from "./index.css";

export const menuItems = [
  { href: "/profile/settings/notifications", label: "알림 설정" },
  { href: "/profile/settings/privacy", label: "개인정보 약관" },
];

export const ProfileMenuSection = () => {
  return (
    <Box className={styles.container} boxShadow="sm" borderRadius="xl" p="2">
      <VStack gap={4}>
        {menuItems.map((item) => (
          <ProfileNavigationLink key={item.label} href={item.href}>
            {item.label}
          </ProfileNavigationLink>
        ))}
      </VStack>
    </Box>
  );
};
