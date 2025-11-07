import { Flex } from "@nugudi/react-components-layout";
import { NavBar } from "@/src/shared/interface-adapters/components/nav-bar";
import { AuthSocialSignUpSection } from "../../sections/auth-social-sign-up-section";
import * as styles from "./index.css";

export const AuthSocialSignUpView = () => {
  return (
    <Flex direction="column" align="start" className={styles.container}>
      <NavBar />
      <AuthSocialSignUpSection />
    </Flex>
  );
};
