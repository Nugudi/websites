import { Flex } from "@nugudi/react-components-layout";
import { AppHeader } from "@/src/shared/ui/components/app-header";
import LogoutButton from "../../components/logout-button";
import MenuSection from "../../sections/menu-section";
import PointSection from "../../sections/point-section";
import ProfileSection from "../../sections/profile-section";
import * as styles from "./index.css";

const ProfilePageView = () => {
  return (
    <Flex direction="column" className={styles.container}>
      <AppHeader />
      <ProfileSection />
      <PointSection />
      <MenuSection />
      <LogoutButton />
    </Flex>
  );
};

export default ProfilePageView;
