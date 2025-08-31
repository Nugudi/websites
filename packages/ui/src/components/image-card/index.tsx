import { Box } from "@nugudi/react-components-layout";
import type { CSSProperties, ReactNode } from "react";
import * as styles from "./index.css";

export interface ImageCardProps {
  children: ReactNode;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "3:2";
  rounded?: boolean;
  roundedTop?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const ImageCard = ({
  children,
  aspectRatio = "16:9",
  rounded = false,
  roundedTop = false,
  className,
  style,
}: ImageCardProps) => {
  const paddingBottom = {
    "16:9": "56.25%",
    "4:3": "75%",
    "1:1": "100%",
    "3:2": "66.67%",
  }[aspectRatio];

  const containerClassName = rounded
    ? styles.imageContainerRounded
    : roundedTop
      ? styles.imageContainerRoundedTop
      : styles.imageContainer;

  return (
    <Box
      className={`${containerClassName} ${className || ""}`}
      style={{
        paddingBottom,
        ...style,
      }}
    >
      <div className={styles.imageWrapper}>{children}</div>
    </Box>
  );
};
