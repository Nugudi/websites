import { Flex } from "@nugudi/react-components-layout";
import { BenefitMenuList } from "../../components/benefit-menu-list";
import * as styles from "./index.css";

export const BenefitMenuSection = () => {
  return (
    <Flex className={styles.container}>
      <BenefitMenuList />
    </Flex>
  );
};
