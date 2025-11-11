import { AppHeader } from "@core/ui/components/app-header";
import { Flex, VStack } from "@nugudi/react-components-layout";
import { UserProfileLogoutButton } from "../../components/user-profile-logout-button";
import { UserProfileMenuSection } from "../../sections/user-profile-menu-section";
import { UserProfilePointSection } from "../../sections/user-profile-point-section";
import { UserProfileSection } from "../../sections/user-profile-section";
import * as styles from "./index.css";

export const UserProfileView = () => {
  return (
    <Flex direction="column" className={styles.container}>
      <AppHeader />
      <VStack w="full">
        <UserProfileSection />
        <UserProfilePointSection />
      </VStack>
      <UserProfileMenuSection />
      <UserProfileLogoutButton />
    </Flex>
  );
};
