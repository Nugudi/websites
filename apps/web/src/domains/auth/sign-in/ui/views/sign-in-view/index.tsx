import { Flex } from "@nugudi/react-components-layout";
import Image from "next/image";
import WelcomeText from "../../components/welcome-text";
import SignInSection from "../../sections/sign-in-section";
import * as styles from "./index.css";

const SignInView = () => {
  return (
    <Flex
      className={styles.container}
      direction="column"
      justify={"space-around"}
      align={"center"}
    >
      <WelcomeText />
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

      <SignInSection />
    </Flex>
  );
};

export default SignInView;
