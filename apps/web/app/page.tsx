import { Heading } from "@nugudi/react-components-layout";
import * as styles from "./page.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Heading as="h1" fontSize="h1" color="main">
        Nugudi UI 컴포넌트 테스트
      </Heading>
    </div>
  );
}
