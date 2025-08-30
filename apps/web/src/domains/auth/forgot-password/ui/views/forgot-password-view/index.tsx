import { Flex } from "@nugudi/react-components-layout";
import NavBar from "@/src/shared/ui/components/nav-bar";
import ForgotPasswordSection from "../../sections/forgot-password-section";
import * as styles from "./index.css";

const ForgotPasswordView = () => {
  return (
    <Flex direction="column" align="start" className={styles.container}>
      <NavBar />
      <ForgotPasswordSection />
    </Flex>
  );
};

export default ForgotPasswordView;
