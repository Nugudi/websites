import { Flex } from "@nugudi/react-components-layout";
import NavBar from "@/src/shared/ui/components/nav-bar";
import PasswordForgotSection from "../../sections/password-forgot-section";
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
