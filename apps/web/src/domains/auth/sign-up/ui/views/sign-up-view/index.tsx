import { Flex } from "@nugudi/react-components-layout";
import SignUpSection from "@/src/domains/auth/sign-up/ui/sections/sign-up-section";
import NavBar from "@/src/shared/ui/components/nav-bar";
import * as styles from "./index.css";

const SignUpView = () => {
  return (
    <Flex direction="column" align="start" className={styles.container}>
      <NavBar />
      <SignUpSection />
    </Flex>
  );
};

export default SignUpView;
