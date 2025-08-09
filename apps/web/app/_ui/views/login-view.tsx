import { LogoTextIcon } from "@nugudi/assets-icons";
import { Flex } from "@nugudi/react-components-layout";
import Image from "next/image";
import LoginSection from "../sections/login-section";
import * as styles from "./login-view.css";

export default function LoginView() {
  return (
    <Flex
      className={styles.container}
      direction="column"
      justify={"space-around"}
    >
      <Flex
        className={styles.textSection}
        direction="column"
        gap={1}
        align="start"
      >
        <Flex gap={6} align="center">
          <LogoTextIcon className={styles.logoTextIcon} />
          <span className={styles.title}>에</span>
        </Flex>
        <span className={styles.title}>오신 것을 환영해요!</span>
      </Flex>
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
}
