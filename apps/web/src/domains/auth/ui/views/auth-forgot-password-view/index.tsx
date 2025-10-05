import { Flex } from "@nugudi/react-components-layout";
import { NavBar } from "@/src/shared/components/nav-bar";
import { AuthForgotPasswordSection } from "../../sections/auth-forgot-password-section";
import * as styles from "./index.css";

export const AuthForgotPasswordView = () => {
  return (
    <Flex direction="column" align="start" className={styles.container}>
      <NavBar />
      <AuthForgotPasswordSection />
    </Flex>
  );
};
