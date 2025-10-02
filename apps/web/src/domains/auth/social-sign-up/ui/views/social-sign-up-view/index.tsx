import { Flex } from "@nugudi/react-components-layout";
import { NavBar } from "@/src/shared/ui/components/nav-bar";
import { SocialSignUpSection } from "../../sections/social-sign-up-section";
import * as styles from "./index.css";

export const SocialSignUpView = () => {
  return (
    <Flex direction="column" align="start" className={styles.container}>
      <NavBar />
      <SocialSignUpSection />
    </Flex>
  );
};
