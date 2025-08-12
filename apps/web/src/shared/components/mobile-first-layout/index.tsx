import { Flex } from "@nugudi/react-components-layout";
import * as styles from "./index.css";

const MobileFirstLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.container}>
      <Flex
        direction="column"
        align="center"
        justify="center"
        className={styles.contentWrapper}
      >
        {children}
      </Flex>
    </div>
  );
};

export default MobileFirstLayout;
