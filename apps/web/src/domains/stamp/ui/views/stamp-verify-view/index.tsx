import { Flex } from "@nugudi/react-components-layout";
import { NavBar } from "@/src/shared/components/nav-bar";
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
