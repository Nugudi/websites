import { LogoTextIcon } from "@nugudi/assets-icons";
import { Flex } from "@nugudi/react-components-layout";
import * as styles from "./index.css";

interface AuthLoginWelcomeProps {
  paddingLeft?: string | number;
  marginTop?: string | number;
}

export const AuthLoginWelcome = ({
  paddingLeft = "2rem",
  marginTop = "10%",
}: AuthLoginWelcomeProps) => {
  return (
    <Flex
      className={styles.textSection}
      direction="column"
      gap={4}
      align="start"
      style={{
        paddingLeft,
        marginTop,
      }}
      aria-label="NUGUDI에 오신 것을 환영해요!"
    >
      <Flex gap={24} align="center">
        <LogoTextIcon className={styles.logoTextIcon} aria-hidden />
        <span className={styles.title}>에</span>
      </Flex>
      <span className={styles.title}>오신 것을 환영해요!</span>
    </Flex>
  );
};
