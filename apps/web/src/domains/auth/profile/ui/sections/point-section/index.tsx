import { ArrowRightIcon, CoinIcon } from "@nugudi/assets-icons";
import { Box, Flex } from "@nugudi/react-components-layout";
import { NavigationItem } from "@nugudi/react-components-navigation-item";
import Link from "next/link";
import * as styles from "./index.css";

const PointSection = () => {
  const point = "3,000";

  return (
    <Box className={styles.container} boxShadow="sm" borderRadius="xl">
      <Link href="/profile/points" className={styles.link}>
        <NavigationItem
          rightIcon={<ArrowRightIcon />}
          size="lg"
          leftIcon={<CoinIcon />}
        >
          <Flex className={styles.contentWrapper}>
            <span className={styles.labelText}>총 포인트</span>
            <h1 className={styles.pointText}>{point} P</h1>
          </Flex>
        </NavigationItem>
      </Link>
    </Box>
  );
};

export default PointSection;
