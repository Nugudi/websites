import { Flex } from "@nugudi/react-components-layout";
import Link from "next/link";
import { TabBar } from "@/src/shared/components/tab-bar";
import * as styles from "./page.css";

const HomePage = () => {
  return (
    <Flex direction="column" className={styles.container}>
      <Link href="/auth/sign-in">로그인</Link>
      <TabBar />
    </Flex>
  );
};

export default HomePage;
