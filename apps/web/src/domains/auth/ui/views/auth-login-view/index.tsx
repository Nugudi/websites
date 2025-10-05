import { Flex } from "@nugudi/react-components-layout";
import Image from "next/image";
import { AuthLoginWelcome } from "../../components/auth-login-welcome";
import { AuthLoginSection } from "../../sections/auth-login-section";
import * as styles from "./index.css";

export const AuthLoginView = () => {
  return (
    <Flex
      className={styles.container}
      direction="column"
      justify="space-around"
      align="center"
    >
      <AuthLoginWelcome />
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

      <AuthLoginSection />
    </Flex>
  );
};
