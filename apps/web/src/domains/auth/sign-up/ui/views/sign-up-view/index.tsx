import { Flex } from "@nugudi/react-components-layout";
import { NavBar } from "@/src/shared/ui/components/nav-bar";
import { SignUpSection } from "../../sections/sign-up-section";
import * as styles from "./index.css";

export const SignUpView = () => {
  return (
    <Flex direction="column" align="start" className={styles.container}>
      <NavBar />
      <SignUpSection />
    </Flex>
  );
};
