import { NavBar } from "@core/ui/components/nav-bar";
import { Flex } from "@nugudi/react-components-layout";
import { StampVerifySection } from "../../sections/stamp-verify-section";
import * as styles from "./index.css";

export const StampVerifyView = () => {
  return (
    <Flex className={styles.container}>
      <NavBar />
      <StampVerifySection />
    </Flex>
  );
};
