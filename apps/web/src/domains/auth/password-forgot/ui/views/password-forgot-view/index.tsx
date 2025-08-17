import { Flex } from "@nugudi/react-components-layout";
import PasswordForgotSection from "@/src/domains/auth/password-forgot/ui/sections/password-forgot-section";
import NavBar from "@/src/shared/ui/components/nav-bar";
import * as styles from "./index.css";

const PasswordForgotView = () => {
  return (
    <Flex direction="column" align="start" className={styles.container}>
      <NavBar />
      <PasswordForgotSection />
    </Flex>
  );
};

export default PasswordForgotView;
