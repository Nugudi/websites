import { Flex } from "@nugudi/react-components-layout";
import { MenuCard } from "@nugudi/react-components-menu-card";
import Link from "next/link";
import TabBar from "@/src/shared/ui/components/tab-bar";
import * as styles from "./page.css";

const HomePage = () => {
  return (
    <Flex direction="column" className={styles.container}>
      <Link href="/auth/sign-in">로그인</Link>
      <MenuCard
        title="너구리 푸드"
        subtitle="너굴너굴 14층"
        timeRange="오전 11시 ~ 오후 2시"
        isPackagingAvailable={true}
        items={[
          { name: "현미밥", category: "RICE" },
          { name: "김치찌개", category: "SOUP" },
          { name: "제육볶음", category: "MAIN_DISH" },
          { name: "계란말이", category: "MAIN_DISH" },
        ]}
      />
      <TabBar />
    </Flex>
  );
};

export default HomePage;
