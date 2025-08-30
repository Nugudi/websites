import { Flex } from "@nugudi/react-components-layout";
import Image from "next/image";
import { LoginWelcome } from "../../components/login-welcome";
import { LoginSection } from "../../sections/login-section";
import * as styles from "./index.css";

export const LoginView = () => {
  return (
    <Flex
      className={styles.container}
      direction="column"
      justify={"space-around"}
      align={"center"}
    >
      <LoginWelcome />
      <div className={styles.logo}>
        <Image
          className={styles.logoImage}
          src="/images/nuguri.webp"
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
