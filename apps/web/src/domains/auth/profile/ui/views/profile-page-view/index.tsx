import { Flex } from "@nugudi/react-components-layout";
import { AppHeader } from "@/src/shared/ui/components/app-header";
import ProfileLogoutButton from "../../components/profile-logout-button";
import ProfileMenuSection from "../../sections/profile-menu-section";
import ProfilePointSection from "../../sections/profile-point-section";
import ProfileSection from "../../sections/profile-section";
import * as styles from "./index.css";

const ProfilePageView = () => {
  return (
    <Flex direction="column" className={styles.container}>
      <AppHeader />
      <ProfileSection />
      <ProfilePointSection />
      <ProfileMenuSection />
      <ProfileLogoutButton />
    </Flex>
  );
};

export default ProfilePageView;
