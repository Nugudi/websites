import { Flex } from "@nugudi/react-components-layout";
import Link from "next/link";
import { AuthLoginDivider } from "../../components/auth-login-divider";
import { AuthLoginSocialButtons } from "../../components/auth-login-social-buttons";
import * as styles from "./index.css";

export const AuthLoginSection = () => {
  return (
    <Flex className={styles.container} direction="column" align="center">
      <Flex
        className={styles.content}
        direction="column"
        gap={32}
        align="center"
      >
        <AuthLoginSocialButtons />
        <AuthLoginDivider />
        <Flex gap={4} align="center">
          <Link href="/auth/sign-in/email" className={styles.authLink}>
            이메일로 로그인
          </Link>
          <span className={styles.divider}>|</span>
          <Link href="/auth/sign-up" className={styles.authLink}>
            회원가입
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
};
