import { Box, Flex } from "@nugudi/react-components-layout";
import LogoutButton from "../../components/logout-button";
import MenuSection from "../../sections/menu-section";
import PointSection from "../../sections/point-section";
import ProfileSection from "../../sections/profile-section";
import * as styles from "./index.css";

const MyPageView = () => {
  return (
    <Flex direction="column" className={styles.container}>
      <ProfileSection />
      <PointSection />
      <MenuSection />
      <LogoutButton />
      <Box w="12" h="20" minW="28" m="80" background="blackAlpha">
        Hello
      </Box>
    </Flex>
  );
};

export default MyPageView;
