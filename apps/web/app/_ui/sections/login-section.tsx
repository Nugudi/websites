import { Flex } from "@nugudi/react-components-layout";
import Link from "next/link";
import { DividerWithText } from "../components/divider-with-text";
import SocialLoginButtons from "../components/social-login-buttons";
import * as styles from "./login-section.css";

export default function LoginSection() {
  return (
    <Flex className={styles.container} direction="column" align="center">
      <Flex
        className={styles.content}
        direction="column"
        gap={32}
        align="center"
      >
        <SocialLoginButtons />
        <DividerWithText />
        <Flex gap={4} align="center">
          <Link href="/login/email" className={styles.authLink}>
            이메일로 로그인
          </Link>
          <span className={styles.divider}>|</span>
          <Link href="/signup" className={styles.authLink}>
            회원가입
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
}
