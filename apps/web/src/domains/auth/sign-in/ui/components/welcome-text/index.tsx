import { LogoTextIcon } from "@nugudi/assets-icons";
import { Flex } from "@nugudi/react-components-layout";
import * as styles from "./index.css";

interface WelcomeTextProps {
  paddingLeft?: string | number;
  marginTop?: string | number;
}

export default function WelcomeText({
  paddingLeft = "2rem",
  marginTop = "10%",
}: WelcomeTextProps) {
  return (
    <Flex
      className={styles.textSection}
      direction="column"
      gap="1"
      align="start"
      style={{
        paddingLeft,
        marginTop,
      }}
      aria-label="NUGUDI에 오신 것을 환영해요!"
    >
      <Flex gap="6" align="center">
        <LogoTextIcon className={styles.logoTextIcon} aria-hidden />
        <span className={styles.title}>에</span>
      </Flex>
      <span className={styles.title}>오신 것을 환영해요!</span>
    </Flex>
  );
}
