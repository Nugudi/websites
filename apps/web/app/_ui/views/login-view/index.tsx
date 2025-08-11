import { Flex } from "@nugudi/react-components-layout";
import Image from "next/image";
import WelcomeText from "../../components/welcome-text";
import LoginSection from "../../sections/login-section";
import * as styles from "./index.css";

const LoginView = () => {
  return (
    <Flex
      className={styles.container}
      direction="column"
      justify={"space-around"}
    >
      <WelcomeText />
      <div className={styles.logo}>
        <Image
          className={styles.logoImage}
          src="/images/nuguri.png"
          alt="logo"
          width={370}
          height={306}
          priority
        />
      </div>

      <LoginSection />
    </Flex>
  );
};

export default LoginView;
