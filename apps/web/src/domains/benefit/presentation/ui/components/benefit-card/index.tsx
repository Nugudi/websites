import { Box, GridItem } from "@nugudi/react-components-layout";
import type { ReactNode } from "react";
import * as styles from "./index.css";

interface BenefitCardProps {
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
}

export const BenefitCard = ({
  title,
  description,
  icon,
  onClick,
}: BenefitCardProps) => {
  return (
    <GridItem className={styles.card} onClick={onClick}>
      <Box className={styles.contentWrapper}>
        {title}
        {description}
      </Box>
      {icon && <Box className={styles.iconWrapper}>{icon}</Box>}
    </GridItem>
  );
};
