import { NavBar } from "@core/ui/components/nav-bar";
import { Flex } from "@nugudi/react-components-layout";
import { AuthSignUpSection } from "../../sections/auth-sign-up-section";
import * as styles from "./index.css";

export const AuthSignUpView = () => {
  return (
    <Flex direction="column" align="start" className={styles.container}>
      <NavBar />
      <AuthSignUpSection />
    </Flex>
  );
};
